import { makeAutoObservable } from 'mobx';
import { Candidate, Comment, Group, Step } from '../config/types';

import { updateStorage } from '../utils/storage';

const update = updateStorage('candidates');

export class CandidateStore {
    candidates: Candidate[] = [];
    selected: string[] = [];
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
        this.selected = [];
        update(this.candidates);
    }

    addCandidate(candidate: Candidate) {
        this.candidates.push(candidate);
        update(this.candidates);
    }

    selectCandidate(id: string) {
        if (!this.selected.includes(id)) {
            this.selected.push(id);
        }
    }

    selectCandidates(ids: string[]) {
        this.selected = [...new Set([...this.selected, ...ids])];
    }

    deselectCandidate(id: string) {
        this.selected = this.selected.filter((cid) => id !== cid);
    }

    deselectCandidates(ids: string[]) {
        this.selected = this.selected.filter((cid) => !ids.includes(cid));
    }

    removeCandidate(id: string) {
        this.candidates = this.candidates.filter(({ _id }) => _id !== id);
        this.selected = this.selected.filter((cid) => cid !== id);
        update(this.candidates);
    }

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
