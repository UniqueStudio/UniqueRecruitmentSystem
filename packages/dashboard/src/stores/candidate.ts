import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { STEP_MAP } from '@config/consts';
import { Group, InterviewType, Step, StepType } from '@config/enums';
import { Candidate, Comment } from '@config/types';
import { groupSort, teamSort } from '@utils/sortByAllocation';

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

export class CandidateStore {
    candidates = new Map<string, Candidate>();

    selected = new Map<string, Candidate>();

    group = Group.web;

    stepType = StepType.all;

    steps: Step[] = allSteps;

    constructor() {
        makeAutoObservable(this);
    }

    addComment(cid: string, comment: Comment) {
        const candidate = this.candidates.get(cid);
        if (!candidate) {
            return;
        }
        candidate.comments.push(comment);
        void set('candidates', toJS(this.candidates));
    }

    removeComment(cid: string, commendId: string) {
        const candidate = this.candidates.get(cid);
        if (!candidate) {
            return;
        }
        candidate.comments = candidate.comments.filter(({ id }) => id !== commendId);
        void set('candidates', toJS(this.candidates));
    }

    setOne(candidate: Candidate) {
        this.candidates.set(candidate.id, candidate);
        void set('candidates', toJS(this.candidates));
    }

    setMany(candidates: Candidate[]) {
        for (const candidate of candidates) {
            this.candidates.set(candidate.id, candidate);
        }
        this.deselectAll();
        void set('candidates', toJS(this.candidates));
    }

    setAll(candidates: Map<string, Candidate>) {
        this.candidates = candidates;
        this.deselectAll();
        void set('candidates', toJS(this.candidates));
    }

    clear() {
        this.candidates.clear();
    }

    selectOne(cid: string) {
        this.selected.set(cid, this.candidates.get(cid)!);
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
        this.candidates.delete(cid);
        this.deselectOne(cid);
        void set('candidates', toJS(this.candidates));
    }

    moveOne(cid: string, to: Step) {
        const candidate = this.candidates.get(cid);
        if (!candidate) {
            return;
        }
        this.deselectOne(cid);
        candidate.step = to;
        void set('candidates', toJS(this.candidates));
    }

    setGroup(group: Group) {
        this.group = group;
    }

    setSteps(stepType: StepType, steps?: Step[]) {
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
        const candidate = this.candidates.get(cid);
        if (!candidate) {
            return;
        }
        candidate.interviewAllocations[type] = time;
        void set('candidates', toJS(this.candidates));
    }

    allocateMany(allocations: { id: string; time?: Date }[], type: InterviewType) {
        allocations.forEach(({ id, time }) => {
            const candidate = this.candidates.get(id);
            if (!candidate) {
                return;
            }
            candidate.interviewAllocations[type] = time;
        });
        void set('candidates', toJS(this.candidates));
    }

    get groupBySteps() {
        const candidates: Candidate[][] = [...new Array(STEP_MAP.size)].map(() => []);
        switch (this.stepType) {
            case StepType.all:
            case StepType.groupInterview:
                for (const [, candidate] of this.candidates) {
                    if (candidate.group === this.group) {
                        candidates[candidate.step].push(candidate);
                    }
                }
                break;
            case StepType.teamInterview:
                for (const [, candidate] of this.candidates) {
                    candidates[candidate.step].push(candidate);
                }
                break;
        }
        candidates[Step.组面].sort(groupSort);
        candidates[Step.群面].sort(teamSort);
        return candidates;
    }
}
