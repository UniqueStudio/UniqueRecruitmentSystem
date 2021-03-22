import { set } from 'idb-keyval';
import { makeAutoObservable } from 'mobx';

import { Recruitment } from '@config/types';
import { localStorage } from '@utils/storage';

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
        void set('recruitments', recruitments);
    }

    setShouldUpdateRecruitment(shouldUpdate = true) {
        this.shouldUpdateRecruitment = shouldUpdate;
    }

    setViewingRecruitment(title: string) {
        this.viewing = title;
        localStorage.setItem('viewing', title);
    }
}
