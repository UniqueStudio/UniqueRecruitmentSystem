import { STEPS } from '../config/consts';

interface Model {
    type: string;
    name: string;
    group: string;
    title: string;
    step: number;
    nextStep: number;
    time: string;
    place: string;
    rest: string;
    url: string;
}

export const generateSMS = ({ name, title, step, type, group, time, place, rest, url, nextStep }: Model) => {
    const suffix = ' (请勿回复本短信)';
    if (!name) throw new Error('Name not provided!');
    switch (type) {
        case 'accept': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            let defaultRest = '';
            switch (nextStep) {
                case 2:
                case 4:
                    if (!url) throw new Error('URL not provided!');
                    defaultRest = `，请进入以下链接选择面试时间：${url}`;
                    break;
                case 1:
                case 3:
                    if (!time || !place) throw new Error('Time or place not provided!');
                    defaultRest = `，请于${time}在${place}参加${STEPS[nextStep]}，请务必准时到场`;
                    break;
                case 5:
                    defaultRest = `，你已成功加入${group}组`;
                    break;
                default:
                    throw new Error('Next step is invalid!');
            }
            rest = `${rest || defaultRest}${suffix}`;
            return { template: 185990, param_list: [name, title, group, STEPS[step], rest] };
        }
        case 'reject': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            if (!step || step < 0 || step > 4) throw new Error('Step is invalid!');
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            rest = `${rest || defaultRest}${suffix}`;
            return { template: 185987, param_list: [name, title, group, STEPS[step], rest] };
        }
        case 'group': {
            if (!group) throw new Error('Group not provided!');
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            return { template: 96404, param_list: [name, time, place, `${group}组组面`] };
        }
        case 'team': {
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            return { template: 96404, param_list: [name, time, place, `团队群面`] };
        }
        default:
            throw new Error('Type not provided!');
    }
};
