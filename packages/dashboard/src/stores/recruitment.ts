import { makeAutoObservable, toJS } from 'mobx';

import { Recruitment } from '@config/types';
import { compareRecruitment } from '@uniqs/utils';
import { primitiveStorage, objectStorage } from '@utils/storage';

export class RecruitmentStore {
    recruitments = new Map<string, Recruitment>();

    viewingId = primitiveStorage.get('viewingId') ?? '';

    constructor() {
        makeAutoObservable(this);
    }

    get recruitmentsArray() {
        return [...this.recruitments.values()].sort((a, b) => compareRecruitment(b.name, a.name));
    }

    get viewingRecruitment() {
        return this.recruitments.get(this.viewingId);
    }

    setRecruitment(recruitment: Partial<Recruitment> & { id: string }, saveToIDB = true) {
        const { id, interviews } = recruitment;
        interviews?.sort((a, b) => {
            if (+a.date === +b.date) {
                return a.period - b.period;
            }
            return +a.date - +b.date;
        });
        this.recruitments.set(id, { ...this.recruitments.get(id), ...(recruitment as Recruitment) });
        if (saveToIDB) {
            void objectStorage.set('recruitments', toJS(this.recruitments));
        }
    }

    setRecruitments(recruitments: Recruitment[]) {
        for (const recruitment of recruitments) {
            this.setRecruitment(recruitment, false);
        }
        void objectStorage.set('recruitments', toJS(this.recruitments));
    }

    setAll(recruitments: Map<string, Recruitment>) {
        this.recruitments = recruitments;
    }

    setViewingRecruitment(rid: string) {
        this.viewingId = rid;
        primitiveStorage.set('viewingId', rid);
    }
}
