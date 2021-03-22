import { set } from 'idb-keyval';
import { makeAutoObservable, toJS } from 'mobx';

import { QR_CODE_URL } from '@config/consts';
import { Message, User } from '@config/types';
import { localStorage } from '@utils/storage';

export class UserStore {
    token: string;

    info = {} as User;

    qrCodeURL = '';

    messages: Message[] = [];

    groupInfo: User[] = [];

    firstLoad = true;

    constructor() {
        const storedToken = localStorage.getItem('token');
        const payload = storedToken?.split('.')[1];
        if (storedToken && payload) {
            const { exp } = JSON.parse(atob(payload));
            this.token = exp > Date.now() / 1000 ? storedToken : '';
        } else {
            this.token = '';
        }
        makeAutoObservable(this);
    }

    get isAdminOrCaptain() {
        return this.info.isAdmin || this.info.isCaptain;
    }

    setQRCode(key: string) {
        this.qrCodeURL = `${QR_CODE_URL}${key}`;
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', this.token);
    }

    logout() {
        this.token = '';
        localStorage.removeItem('token');
    }

    setUserInfo(userInfo: Partial<User>) {
        delete userInfo.password;
        Object.assign(this.info, userInfo);
        void set('user', toJS(this.info));
        const user = this.groupInfo.find(({ _id }) => this.info._id === _id);
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
