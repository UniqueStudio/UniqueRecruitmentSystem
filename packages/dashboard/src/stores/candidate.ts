import { makeAutoObservable } from 'mobx';

import { Candidate, Comment, Group, Step } from '../config/types';
import { updateStorage } from '../utils/storage';

const update = updateStorage('candidates');

export class CandidateStore {
    candidates: Candidate[] = [];

    selected = new Map<string, Candidate>();

    group: Group = 'web';

    steps: Step[] = [0, 1, 2, 3, 4, 5];

    constructor() {
        makeAutoObservable(this);
    }

    addComment(cid: string, comment: Comment) {
        const candidate = this.candidates.find(({ _id }) => _id === cid);
        if (!candidate) {
            return;
        }
        candidate.comments.push(comment);
        update(this.candidates);
    }

    removeComment(cid: string, id: string) {
        const candidate = this.candidates.find(({ _id }) => _id === cid);
        if (!candidate) {
            return;
        }
        candidate.comments = candidate.comments.filter(({ _id }) => _id !== id);
        update(this.candidates);
    }

    addCandidates(candidates: Candidate[]) {
        this.candidates = candidates;
        this.deselectAll();
        update(this.candidates);
    }

    addCandidate(candidate: Candidate) {
        this.candidates.push(candidate);
        update(this.candidates);
    }

    selectCandidate(id: string) {
        this.selected.set(id, this.candidates.find(({ _id }) => id === _id)!);
    }

    selectCandidates(ids: string[]) {
        for (const id of ids) {
            this.selectCandidate(id);
        }
    }

    deselectCandidate(id: string) {
        this.selected.delete(id);
    }

    deselectCandidates(ids: string[]) {
        for (const id of ids) {
            this.deselectCandidate(id);
        }
    }

    deselectAll() {
        this.selected.clear();
    }

    removeCandidate(id: string) {
        this.candidates = this.candidates.filter(({ _id }) => _id !== id);
        this.deselectCandidate(id);
        update(this.candidates);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    moveCandidate(id: string, from: Step, to: Step, position?: number) {
        const candidate = this.candidates.find(({ _id }) => _id === id);
        if (!candidate) {
            return;
        }
        candidate.step = to;
        update(this.candidates);
    }

    setGroup(group: Group) {
        this.group = group;
    }

    setSteps(stepType: number, steps?: Step[]) {
        if (steps) {
            this.steps = steps;
        } else {
            this.steps = stepType === 1 ? [4, 5] : [0, 1, 2, 3, 4, 5];
        }
    }

    allocateOne(interviewType: 'group' | 'team', id: string, time: number) {
        const candidate = this.candidates.find(({ _id }) => _id === id);
        if (!candidate) {
            return;
        }
        candidate.interviews[interviewType].allocation = time;
        update(this.candidates);
    }

    allocateAll(allocations: { id: string; time: number }[], interviewType: 'group' | 'team') {
        allocations.forEach(({ id, time }) => {
            const candidate = this.candidates.find(({ _id }) => _id === id);
            if (!candidate) {
                return;
            }
            candidate.interviews[interviewType].allocation = time;
        });
        update(this.candidates);
    }
}
