import { validateJWT } from '@uniqs/utils';
import { makeAutoObservable, toJS } from 'mobx';

import { Member, Message } from '@config/types';
import { objectStorage, primitiveStorage } from '@utils/storage';

export class MemberStore {
    token: string;

    info = {} as Member;

    qrCodeURL = '';

    messages: Message[] = [];

    groupInfo: Member[] = [];

    firstLoad = true;

    constructor() {
        const token = primitiveStorage.get('token');
        this.token = validateJWT(token) ? token : '';
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
        primitiveStorage.set('token', this.token);
    }

    logout() {
        this.token = '';
        primitiveStorage.del('token');
    }

    setMyInfo(myInfo: Partial<Member>) {
        delete myInfo.password;
        Object.assign(this.info, myInfo);
        void objectStorage.set('member', toJS(this.info));
        const member = this.groupInfo.find(({ id }) => this.info.id === id);
        if (member) {
            Object.assign(member, myInfo);
            void objectStorage.set('group', toJS(this.groupInfo));
        }
    }

    setGroupInfo(groupInfo: Member[]) {
        this.groupInfo = groupInfo;
        this.firstLoad = false;
        void objectStorage.set('group', groupInfo);
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
        void objectStorage.set('group', toJS(this.groupInfo));
    }
}
