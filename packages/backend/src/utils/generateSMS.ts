import { STEPS } from '@config/consts';

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
    if (!name) throw new Error('Name not provided!');
    switch (type) {
        case 'accept': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            switch (nextStep) {
                case 2:
                case 4:
                    if (!url) throw new Error('URL not provided!');
                    // {1}你好，你通过了{2}{3}组{4}审核，请{5}以完成下一流程：{6} (请勿回复本短信)
                    return {
                        template: 735443,
                        param_list: [name, title, group, STEPS[step], '进入以下链接选择面试时间', url],
                    };
                case 1:
                case 3:
                    // {1}你好，请于{2}在启明学院亮胜楼{3}参加{4}，请准时到场。
                    if (!time || !place) throw new Error('Time or place not provided!');
                    return { template: 670906, param_list: [name, time, place, STEPS[nextStep]] };
                case 5:
                    // {1}你好，你在{2}中已成功加入{3}组！
                    return { template: 670904, param_list: [name, title, group] };
                default:
                    throw new Error('Next step is invalid!');
            }
        }
        case 'reject': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            if (step === undefined || step < 0 || step > 4) throw new Error('Step is invalid!');
            // {1}你好，你没有通过{2}{3}组{4}审核，请你不要灰心，继续学习。期待与更强大的你的相遇！
            return { template: 735719, param_list: [name, title, group, STEPS[step]] };
        }
        case 'group': {
            if (!group) throw new Error('Group not provided!');
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            // {1}你好，请于{2}在启明学院亮胜楼{3}参加{4}，请准时到场。
            return { template: 670906, param_list: [name, time, place, `${group}组组面`] };
        }
        case 'team': {
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            // {1}你好，请于{2}在启明学院亮胜楼{3}参加{4}，请准时到场。
            return { template: 670906, param_list: [name, time, place, `团队群面`] };
        }

        default:
            throw new Error('Type not provided!');
    }
};
