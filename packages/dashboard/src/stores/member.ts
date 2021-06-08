import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { Message, Member } from '@config/types';
import { primitiveStorage } from '@utils/storage';

export class MemberStore {
    token: string;

    info = {} as Member;

    qrCodeURL = '';

    messages: Message[] = [];

    groupInfo: Member[] = [];

    firstLoad = true;

    constructor() {
        const token = primitiveStorage.getItem('token');
        const payload = token?.split('.')[1];
        if (token && payload) {
            const { exp } = JSON.parse(atob(payload)) as { exp: number };
            this.token = exp * 1000 > Date.now() ? token : '';
        } else {
            this.token = '';
        }
        makeAutoObservable(this);
    }

    get isAdminOrCaptain() {
        return this.info.isAdmin || this.info.isCaptain;
    }

    setQRCode(url: string) {
        this.qrCodeURL = url;
    }

    setToken(token: string) {
        this.token = token;
        primitiveStorage.setItem('token', this.token);
    }

    logout() {
        this.token = '';
        primitiveStorage.removeItem('token');
    }

    setMyInfo(myInfo: Partial<Member>) {
        delete myInfo.password;
        Object.assign(this.info, myInfo);
        void set('member', toJS(this.info));
        const member = this.groupInfo.find(({ id }) => this.info.id === id);
        if (member) {
            Object.assign(member, myInfo);
            void set('group', toJS(this.groupInfo));
        }
    }

    setGroupInfo(groupInfo: Member[]) {
        this.groupInfo = groupInfo;
        this.firstLoad = false;
        void set('group', groupInfo);
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messages.sort((a, b) => a.time - b.time);
    }

    setGroupAdmins(admins: string[]) {
        this.groupInfo.forEach((member) => {
            if (admins.includes(member.phone)) {
                member.isAdmin = true;
            }
        });
        void set('group', toJS(this.groupInfo));
    }
}
