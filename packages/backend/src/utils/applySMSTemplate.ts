import { STEPS } from '@constants/consts';
import { SMSType, Step } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';

const fullRecruitmentName = (name: string) => {
    const last = name.slice(4);
    const abbr = ['S', 'C', 'A'];
    const full = ['春季招新', '夏令营招新', '秋季招新'];
    const i = abbr.indexOf(last);
    if (i >= 0) {
        return name.slice(0, 4) + full[i];
    }
    const j = full.indexOf(last);
    if (j >= 0) {
        return name.slice(0, 4) + abbr[i];
    }
    throw new Error('parameter is not a valid title');
};

interface Model {
    type: SMSType;
    candidate: CandidateEntity;
    next: Step;
    time?: string;
    place?: string;
    rest?: string;
}

export const applySMSTemplate = (
    { type, time, place, rest, next, candidate: { group, step, recruitment, name, interviews } }: Model,
) => {
    const suffix = ' (请勿回复本短信)';
    const recruitmentName = fullRecruitmentName(recruitment.name);
    switch (type) {
        case SMSType.accept: {
            let defaultRest = '';
            switch (next) {
                case Step.组面:
                case Step.群面:
                    defaultRest = '，请进入选手dashboard系统选择面试时间';
                    break;
                case Step.笔试:
                case Step.熬测:
                    if (!place) throw new Error('Place is not provided!');
                    if (!time) throw new Error('Time is not provided!');
                    defaultRest = `，请于${time}在${place}参加${STEPS[next]}，请务必准时到场`;
                    break;
                case Step.通过:
                    defaultRest = `，你已成功加入${group}组`;
                    break;
                default:
                    throw new Error('Next step is invalid!');
            }
            rest = `${rest || defaultRest}${suffix}`;
            // {1}你好，你通过了{2}{3}组{4}审核{5}
            return { template: 670901, params: [name, recruitmentName, group, STEPS[step], rest] };
        }
        case SMSType.reject: {
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            rest = `${rest || defaultRest}${suffix}`;
            // {1}你好，你没有通过{2}{3}组{4}审核，请你{5}
            return { template: 670903, params: [name, recruitmentName, group, STEPS[step], rest] };
        }
        default: {
            const { allocation } = interviews[type];
            if (!place) throw new Error('Place is not provided!');
            if (!allocation) throw new Error(`Interview time is not allocated for ${name}`);
            time = allocation.toLocaleString('zh-CN', {
                dateStyle: 'full',
                timeStyle: 'long',
                timeZone: 'Asia/Shanghai',
                hour12: false,
            });
            // {1}你好，请于{2}在启明学院亮胜楼{3}参加{4}，请准时到场。
            return { template: 670906, params: [name, time, place, type === SMSType.group ? `${group}组组面` : '群面'] };
        }
    }
};
