import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { basename, join } from 'path';

import { INestApplication } from '@nestjs/common';

import { Gender, Grade, Group, GroupOrTeam, Period, Rank, Step } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { ConfigService } from '@services/config.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';
import { hash } from '@utils/scrypt';

interface User {
    weChatID: string;
    avatar: string;
    gender: Gender;
    group: Group;
    isAdmin: boolean;
    isCaptain: boolean;
    joinTime: string;
    mail: string;
    password?: {
        hash: string;
        salt: string;
    };
    phone: string;
    username: string;
}

interface Recruitment<T = number> {
    begin: number;
    stop: number;
    end: number;
    title: string;
    interview: { date: T; afternoon: number; evening: number; morning: number }[];
    groups: {
        name: Group;
        interview: Recruitment['interview'];
    }[];
}

interface Candidate {
    name: string;
    grade: number;
    title: string;
    group: Group;
    abandon: boolean;
    comments: [];
    gender: Gender;
    institute: string;
    interviews: Record<'group' | 'team', {
        allocation?: string | { $numberLong: string };
        selection: Recruitment<string | { $numberLong: string }>['interview'];
    }>;
    intro: string;
    isQuick: boolean;
    mail: string;
    major: string;
    phone: string;
    rank: Rank;
    referrer: string;
    rejected: boolean;
    resume?: string;
    step: number;
}

export const migrate = async (app: INestApplication) => {
    const config = app.get(ConfigService);
    const path = config.backupPath;
    if (!path) {
        throw new Error('MIGRATION_BACKUP_PATH is not specified');
    }
    const users: User[] = JSON.parse(readFileSync(join(path, 'users.json')).toString());
    const recruitments: Recruitment[] = JSON.parse(readFileSync(join(path, 'recruitments.json')).toString());
    const candidates: Candidate[] = JSON.parse(readFileSync(join(path, 'candidates.json')).toString());
    const usersService = app.get(UsersService);
    const recruitmentsService = app.get(RecruitmentsService);
    const candidatesService = app.get(CandidatesService);
    const interviewsService = app.get(InterviewsService);
    const commentsService = app.get(CommentsService);
    await commentsService.clear();
    await candidatesService.clear();
    await interviewsService.clear();
    await recruitmentsService.clear();
    await usersService.clear();
    await Promise.all(users.map(async (
        { weChatID, avatar, gender, group, isAdmin, isCaptain, joinTime, mail, phone, username },
    ) => {
        await usersService.createAndSave({
            weChatID,
            name: username,
            joinTime: joinTime === '2018年3月' ? '2018S' // two lucky guys
                : joinTime === '2017日常招新' ? '2017A' // this kind of recruitments are not supported yet
                    : joinTime.replaceAll('年', ''),
            phone,
            mail: mail || undefined,
            gender,
            group: Group[group],
            avatar: avatar || undefined,
            isAdmin,
            isCaptain,
            password: await hash(randomBytes(512).toString('hex')),
        });
    }));
    await Promise.all(recruitments.map(async (
        { stop, begin, end, groups, interview, title },
    ) => {
        const recruitment = await recruitmentsService.createAndSave({
            beginning: new Date(begin),
            end: new Date(end),
            deadline: new Date(stop),
            name: title,
        });
        for (const { date, afternoon, evening, morning } of interview) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            await interviewsService.createAndSave({
                date: d,
                period: Period.morning,
                slotNumber: Math.max(morning, 0),
                name: GroupOrTeam.unique,
                recruitment,
            });
            await interviewsService.createAndSave({
                date: d,
                period: Period.afternoon,
                slotNumber: Math.max(afternoon, 0),
                name: GroupOrTeam.unique,
                recruitment,
            });
            await interviewsService.createAndSave({
                date: d,
                period: Period.evening,
                slotNumber: Math.max(evening, 0),
                name: GroupOrTeam.unique,
                recruitment,
            });
        }
        for (const { name, interview } of groups) {
            for (const { date, afternoon, evening, morning } of interview) {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                await interviewsService.createAndSave({
                    date: d,
                    period: Period.morning,
                    slotNumber: Math.max(morning, 0),
                    name: GroupOrTeam[name],
                    recruitment,
                });
                await interviewsService.createAndSave({
                    date: d,
                    period: Period.afternoon,
                    slotNumber: Math.max(afternoon, 0),
                    name: GroupOrTeam[name],
                    recruitment,
                });
                await interviewsService.createAndSave({
                    date: d,
                    period: Period.evening,
                    slotNumber: Math.max(evening, 0),
                    name: GroupOrTeam[name],
                    recruitment,
                });
            }
        }
    }));
    await Promise.all(candidates.map(async (
        {
            name,
            grade,
            title,
            group,
            abandon,
            comments,
            gender,
            institute,
            interviews,
            intro,
            isQuick,
            mail,
            major,
            phone,
            rank,
            referrer,
            rejected,
            resume,
            step,
        },
    ) => {
        const interviewAllocations: Record<string, Date> = {};
        if (interviews.group.allocation) {
            const date = interviews.group.allocation;
            interviewAllocations.group = new Date(typeof date === 'object' ? +date.$numberLong : +date);
        }
        if (interviews.team.allocation) {
            const date = interviews.team.allocation;
            interviewAllocations.team = new Date(typeof date === 'object' ? +date.$numberLong : +date);
        }
        const recruitment = await recruitmentsService.findOne({ name: title });
        const interviewSelections = [];
        for (const { date, morning, afternoon, evening } of interviews.group.selection) {
            const d = new Date(typeof date === 'object' ? +date.$numberLong : +date);
            d.setHours(0, 0, 0, 0);
            morning && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.morning,
                name: GroupOrTeam[group],
            }));
            afternoon && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.afternoon,
                name: GroupOrTeam[group],
            }));
            evening && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.evening,
                name: GroupOrTeam[group],
            }));
        }
        for (const { date, morning, afternoon, evening } of interviews.team.selection) {
            const d = new Date(typeof date === 'object' ? +date['$numberLong'] : +date);
            d.setHours(0, 0, 0, 0);
            morning && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.morning,
                name: GroupOrTeam.unique,
            }));
            afternoon && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.afternoon,
                name: GroupOrTeam.unique,
            }));
            evening && interviewSelections.push(await interviewsService.findOne({
                date: d,
                period: Period.evening,
                name: GroupOrTeam.unique,
            }));
        }
        const candidate = await candidatesService.createAndSave({
            name,
            grade: [Grade.freshman, Grade.sophomore, Grade.junior, Grade.senior][grade] || Grade.graduate,
            group,
            abandoned: abandon,
            rejected,
            referrer,
            resume: resume ? basename(resume) : undefined,
            step: [Step.报名, Step.笔试, Step.组面, Step.熬测, Step.群面, Step.通过][step],
            gender,
            institute,
            intro,
            isQuick,
            mail,
            phone,
            major,
            rank,
            recruitment,
            interviewAllocations,
            interviewSelections: interviewSelections.filter(Boolean) as InterviewEntity[],
        });
        for (const { username, content, evaluation } of comments) {
            const users = await usersService.find({ where: { name: username } });
            if (!users.length) {
                continue;
            }
            const user = users[0];
            await commentsService.createAndSave({
                user,
                evaluation,
                content,
                candidate,
            });
        }
    }));
    console.log('migration finished');
};
