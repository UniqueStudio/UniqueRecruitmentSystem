import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { Message, User } from '@config/types';
import { primitiveStorage } from '@utils/storage';

export class UserStore {
    token: string;

    info = {} as User;

    qrCodeURL = '';

    messages: Message[] = [];

    groupInfo: User[] = [];

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

    setUserInfo(userInfo: Partial<User>) {
        delete userInfo.password;
        Object.assign(this.info, userInfo);
        void set('user', toJS(this.info));
        const user = this.groupInfo.find(({ id }) => this.info.id === id);
        if (user) {
            Object.assign(user, userInfo);
            void set('group', toJS(this.groupInfo));
        }
    }

    setGroupInfo(groupInfo: User[]) {
        this.groupInfo = groupInfo;
        this.firstLoad = false;
        void set('group', groupInfo);
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messages.sort((a, b) => a.time - b.time);
    }

    setGroupAdmins(admins: string[]) {
        this.groupInfo.forEach((user) => {
            if (admins.includes(user.phone)) {
                user.isAdmin = true;
            }
        });
        void set('group', toJS(this.groupInfo));
    }
}
