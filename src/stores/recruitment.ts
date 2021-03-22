import { makeAutoObservable } from 'mobx';

import { Recruitment } from '../config/types';
import { localStorage, updateStorage } from '../utils/storage';

const updateViewing = updateStorage('viewing');
const updateRecruitments = updateStorage('recruitments');

export class RecruitmentStore {
    recruitments: Recruitment[] = [];

    viewing = localStorage.getItem('viewing') || '';

    shouldUpdateRecruitment = true;

    constructor() {
        makeAutoObservable(this);
    }

    setRecruitments(recruitments: Recruitment[]) {
        this.recruitments = recruitments;
        this.shouldUpdateRecruitment = false;
        updateRecruitments(this.recruitments);
    }

    setShouldUpdateRecruitment(shouldUpdate = true) {
        this.shouldUpdateRecruitment = shouldUpdate;
    }

    setViewingRecruitment(title: string) {
        this.viewing = title;
        updateViewing(title);
    }
}
