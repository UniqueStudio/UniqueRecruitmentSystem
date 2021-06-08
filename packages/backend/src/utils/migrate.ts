import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { basename, join } from 'path';

import { INestApplication } from '@nestjs/common';

import { Gender, Grade, Group, GroupOrTeam, Period, Rank, Step } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { ApplicationsService } from '@services/applications.service';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { ConfigService } from '@services/config.service';
import { InterviewsService } from '@services/interviews.service';
import { MembersService } from '@services/members.service';
import { RecruitmentsService } from '@services/recruitments.service';
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
    interviews: Record<'group' | 'team',
        {
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
    const users = JSON.parse(readFileSync(join(path, 'users.json')).toString()) as User[];
    const recruitments = JSON.parse(readFileSync(join(path, 'recruitments.json')).toString()) as Recruitment[];
    const candidates = JSON.parse(readFileSync(join(path, 'candidates.json')).toString()) as Candidate[];
    const membersService = app.get(MembersService);
    const recruitmentsService = app.get(RecruitmentsService);
    const candidatesService = app.get(CandidatesService);
    const applicationsService = app.get(ApplicationsService);
    const interviewsService = app.get(InterviewsService);
    const commentsService = app.get(CommentsService);
    await commentsService.clear();
    await applicationsService.clear();
    await candidatesService.clear();
    await interviewsService.clear();
    await recruitmentsService.clear();
    await membersService.clear();
    await Promise.all(
        users.map(
            async ({
                       weChatID,
                       avatar,
                       gender,
                       group,
                       isAdmin,
                       isCaptain,
                       joinTime,
                       mail,
                       phone,
                       username,
                       password,
                   }) => {
                if (password) {
                    password.hash = Buffer.from(password.hash).toString('base64');
                } else {
                    password = await hash(randomBytes(512).toString('hex'));
                }
                joinTime =
                    joinTime === '2018年3月'
                        ? '2018S' // two lucky guys
                        : joinTime === '2017日常招新'
                            ? '2017A' // this kind of recruitments are not supported yet
                            : joinTime.replaceAll('年', '');
                await membersService.createAndSave({
                    createdAt: new Date(+joinTime.slice(0, 4), { S: 4, C: 8, A: 10 }[joinTime[4]]! - 1, 1),
                    weChatID,
                    name: username,
                    joinTime,
                    phone,
                    mail: mail || undefined,
                    gender,
                    group: Group[group],
                    avatar: avatar || undefined,
                    isAdmin,
                    isCaptain,
                    password,
                });
            },
        ),
    );
    await Promise.all(
        recruitments.map(async ({ stop, begin, end, groups, interview, title }) => {
            const recruitment = await recruitmentsService.createAndSave({
                createdAt: new Date(begin),
                beginning: new Date(begin),
                end: new Date(end),
                deadline: new Date(stop),
                name: title,
            });
            for (const { date, afternoon, evening, morning } of interview) {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                if (morning > 0) {
                    await interviewsService.createAndSave({
                        date: d,
                        period: Period.morning,
                        slotNumber: morning,
                        name: GroupOrTeam.unique,
                        recruitment,
                    });
                }
                if (afternoon > 0) {
                    await interviewsService.createAndSave({
                        date: d,
                        period: Period.afternoon,
                        slotNumber: afternoon,
                        name: GroupOrTeam.unique,
                        recruitment,
                    });
                }
                if (evening > 0) {
                    await interviewsService.createAndSave({
                        date: d,
                        period: Period.evening,
                        slotNumber: evening,
                        name: GroupOrTeam.unique,
                        recruitment,
                    });
                }
            }
            for (const { name, interview } of groups) {
                for (const { date, afternoon, evening, morning } of interview) {
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    if (morning > 0) {
                        await interviewsService.createAndSave({
                            date: d,
                            period: Period.morning,
                            slotNumber: morning,
                            name: GroupOrTeam[name],
                            recruitment,
                        });
                    }
                    if (afternoon > 0) {
                        await interviewsService.createAndSave({
                            date: d,
                            period: Period.afternoon,
                            slotNumber: afternoon,
                            name: GroupOrTeam[name],
                            recruitment,
                        });
                    }
                    if (evening > 0) {
                        await interviewsService.createAndSave({
                            date: d,
                            period: Period.evening,
                            slotNumber: evening,
                            name: GroupOrTeam[name],
                            recruitment,
                        });
                    }
                }
            }
        }),
    );
    for (const {
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
    } of candidates) {
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
            if (morning) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.morning,
                        name: GroupOrTeam[group],
                    }),
                );
            }
            if (afternoon) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.afternoon,
                        name: GroupOrTeam[group],
                    }),
                );
            }
            if (evening) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.evening,
                        name: GroupOrTeam[group],
                    }),
                );
            }
        }
        for (const { date, morning, afternoon, evening } of interviews.team.selection) {
            const d = new Date(typeof date === 'object' ? +date.$numberLong : +date);
            d.setHours(0, 0, 0, 0);
            if (morning) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.morning,
                        name: GroupOrTeam.unique,
                    }),
                );
            }
            if (afternoon) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.afternoon,
                        name: GroupOrTeam.unique,
                    }),
                );
            }
            if (evening) {
                interviewSelections.push(
                    await interviewsService.findOne({
                        date: d,
                        period: Period.evening,
                        name: GroupOrTeam.unique,
                    }),
                );
            }
        }
        const candidate = await candidatesService.findOne({ phone })
            ?? await candidatesService.findOne({ mail })
            ?? await candidatesService.createAndSave({
                name,
                phone,
                gender,
                mail,
                password: await hash(randomBytes(512).toString('hex')),
            });
        let application = await applicationsService.findOne({ candidate, recruitment });
        const data = {
            grade: [Grade.freshman, Grade.sophomore, Grade.junior, Grade.senior][grade] ?? Grade.graduate,
            group,
            abandoned: abandon,
            rejected,
            referrer,
            resume: resume ? basename(resume) : undefined,
            step: [Step.报名, Step.笔试, Step.组面, Step.熬测, Step.群面, Step.通过][step],
            institute,
            intro,
            isQuick,
            major,
            rank,
            candidate,
            recruitment,
            interviewAllocations,
            interviewSelections: interviewSelections.filter(Boolean) as InterviewEntity[],
        };
        if (application) {
            // if `application` exists, it means that a candidate applied to the recruitment twice
            // with different phone numbers, but the emails are the same.
            // In this case, we only choose one application whose `step` is biggest.
            if (step > application.step) {
                Object.assign(application, data);
                await application.save();
            }
        } else {
            application = await applicationsService.createAndSave(data);
        }
        for (const { username, content, evaluation } of comments) {
            const users = await membersService.find({ where: { name: username } });
            if (!users.length) {
                continue;
            }
            const user = users[0];
            await commentsService.createAndSave({
                user,
                evaluation,
                content,
                candidate: application,
            });
        }
    }
    console.log('migration finished');
};
