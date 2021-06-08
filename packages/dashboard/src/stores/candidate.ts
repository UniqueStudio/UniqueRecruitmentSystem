import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { STEP_MAP } from '@config/consts';
import { Group, InterviewType, Step, StepType } from '@config/enums';
import { Application, Comment } from '@config/types';
import { groupSort, teamSort } from '@utils/sort';

const allSteps = [
    Step.报名,
    Step.笔试,
    Step.组面时间选择,
    Step.组面,
    Step.熬测,
    Step.群面时间选择,
    Step.群面,
    Step.通过,
];
const teamInterviewSteps = [Step.群面, Step.通过];
const groupInterviewSteps = [Step.组面, Step.熬测];

export class ApplicationStore {
    applications = new Map<string, Application>();

    selected = new Map<string, Application>();

    group = Group.web;

    stepType = StepType.all;

    steps: Step[] = allSteps;

    constructor() {
        makeAutoObservable(this);
    }

    addComment(cid: string, comment: Comment) {
        const candidate = this.applications.get(cid);
        if (!candidate) {
            return;
        }
        candidate.comments.push(comment);
        void set('candidates', toJS(this.applications));
    }

    removeComment(cid: string, commendId: string) {
        const candidate = this.applications.get(cid);
        if (!candidate) {
            return;
        }
        candidate.comments = candidate.comments.filter(({ id }) => id !== commendId);
        void set('candidates', toJS(this.applications));
    }

    setOne(candidate: Application) {
        this.applications.set(candidate.id, candidate);
        void set('candidates', toJS(this.applications));
    }

    setMany(candidates: Application[]) {
        for (const candidate of candidates) {
            this.applications.set(candidate.id, candidate);
        }
        this.deselectAll();
        void set('candidates', toJS(this.applications));
    }

    setAll(candidates: Map<string, Application>) {
        this.applications = candidates;
        this.deselectAll();
        void set('candidates', toJS(this.applications));
    }

    clear() {
        this.applications.clear();
    }

    selectOne(cid: string) {
        this.selected.set(cid, this.applications.get(cid)!);
    }

    selectMany(cids: string[]) {
        for (const cid of cids) {
            this.selectOne(cid);
        }
    }

    deselectOne(cid: string) {
        this.selected.delete(cid);
    }

    deselectMany(cids: string[]) {
        for (const cid of cids) {
            this.deselectOne(cid);
        }
    }

    deselectAll() {
        this.selected.clear();
    }

    removeOne(cid: string) {
        this.applications.delete(cid);
        this.deselectOne(cid);
        void set('candidates', toJS(this.applications));
    }

    moveOne(cid: string, to: Step) {
        const candidate = this.applications.get(cid);
        if (!candidate) {
            return;
        }
        this.deselectOne(cid);
        candidate.step = to;
        void set('candidates', toJS(this.applications));
    }

    setGroup(group: Group) {
        this.deselectAll();
        this.group = group;
    }

    setSteps(stepType: StepType, steps?: Step[]) {
        this.deselectAll();
        this.stepType = stepType;
        if (steps) {
            this.steps = steps;
        } else {
            switch (stepType) {
                case StepType.all:
                    this.steps = allSteps;
                    break;
                case StepType.groupInterview:
                    this.steps = groupInterviewSteps;
                    break;
                case StepType.teamInterview:
                    this.steps = teamInterviewSteps;
                    break;
            }
        }
    }

    allocateOne(type: InterviewType, cid: string, time: Date) {
        const candidate = this.applications.get(cid);
        if (!candidate) {
            return;
        }
        candidate.interviewAllocations[type] = time;
        void set('candidates', toJS(this.applications));
    }

    allocateMany(allocations: { id: string; time?: Date }[], type: InterviewType) {
        allocations.forEach(({ id, time }) => {
            const candidate = this.applications.get(id);
            if (!candidate) {
                return;
            }
            candidate.interviewAllocations[type] = time;
        });
        void set('candidates', toJS(this.applications));
    }

    get groupBySteps() {
        const candidates: Application[][] = [...new Array<unknown>(STEP_MAP.size)].map(() => []);
        switch (this.stepType) {
            case StepType.all:
            case StepType.groupInterview:
                for (const [, candidate] of this.applications) {
                    if (candidate.group === this.group) {
                        candidates[candidate.step].push(candidate);
                    }
                }
                break;
            case StepType.teamInterview:
                for (const [, candidate] of this.applications) {
                    candidates[candidate.step].push(candidate);
                }
                break;
        }
        candidates[Step.组面].sort(groupSort);
        candidates[Step.群面].sort(teamSort);
        return candidates;
    }
}
