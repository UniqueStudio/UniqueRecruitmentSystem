import { makeAutoObservable } from 'mobx';
import { setAuthToken } from '../apis/rest';
import { Message, User } from '../config/types';
import { localStorage, updateStorage } from '../utils/storage';

const updateUser = updateStorage('user');
const updateGroup = updateStorage('group');

export class UserStore {
    token: string;
    info = {} as User;
    qrCodePath = '';
    messages: Message[] = [];
    groupInfo: User[] = [];
    firstLoad = true;

    constructor() {
        const storedToken = localStorage.getItem('token');
        const payload = storedToken && storedToken.split('.')[1];
        const time = payload && JSON.parse(atob(payload)).exp;
        this.token = storedToken !== null && time > Date.now() / 1000 ? storedToken : '';
        setAuthToken(this.token);
        makeAutoObservable(this);
    }

    get isAdminOrCaptain() {
        return this.info.isAdmin || this.info.isCaptain;
    }

    setQRCode(key: string) {
        this.qrCodePath = key;
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', this.token);
        setAuthToken(this.token);
    }

    logout() {
        localStorage.removeItem('token');
        this.token = '';
        setAuthToken(this.token);
    }

    setUserInfo(userInfo: Partial<User>) {
        delete userInfo.password;
        Object.assign(this.info, userInfo);
        updateUser(this.info);
        const user = this.groupInfo.find(({ _id }) => userInfo._id === _id);
        if (user) {
            Object.assign(user, userInfo);
            updateGroup(this.groupInfo);
        }
    }

    setGroupInfo(groupInfo: User[]) {
        this.groupInfo = groupInfo;
        this.firstLoad = false;
        updateGroup(this.groupInfo);
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
        updateGroup(this.groupInfo);
    }
}
