import { STEP_MAP, SMS_TEMPLATE_MAP } from '@constants/consts';
import { SMSTemplateType, SMSType, Step } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { SMSTemplate } from '@uniqs/config';
import { convertRecruitmentName } from '@uniqs/utils';

interface Template extends SMSTemplate {
    application: ApplicationEntity;
}

export const applySMSTemplate = ({
    type,
    time,
    place,
    rest,
    next,
    current,
    application: { group, recruitment, candidate: { name }, interviewAllocations },
}: Template) => {
    const suffix = ' (请勿回复本短信)';
    const recruitmentName = convertRecruitmentName(recruitment.name);
    switch (type) {
        case SMSType.accept: {
            let defaultRest = '';
            switch (next) {
                case Step.组面:
                case Step.群面: {
                    const allocation = next === Step.组面 ? interviewAllocations.group : interviewAllocations.team;
                    if (!place) throw new Error('Place is not provided!');
                    if (!allocation) throw new Error(`Interview time is not allocated for ${name}`);
                    // 2011年11月11日星期五中国标准时间 11:11:11
                    time = allocation.toLocaleString('zh-CN', {
                        dateStyle: 'full',
                        timeStyle: 'full',
                        timeZone: 'Asia/Shanghai',
                        hour12: false,
                    });
                    // FIXME
                    // {1}你好，请于{2}在启明学院亮胜楼{3}参加{4}，请准时到场。
                    return {
                        template: SMS_TEMPLATE_MAP.get(SMSTemplateType.Interview)!,
                        params: [name, time, place, STEP_MAP.get(next)!],
                    };
                }
                case Step.笔试:
                case Step.熬测:
                    if (!place) throw new Error('Place is not provided!');
                    if (!time) throw new Error('Time is not provided!');
                    defaultRest = `，请于${time}在${place}参加${STEP_MAP.get(next)!}，请务必准时到场`;
                    break;
                case Step.通过:
                    defaultRest = `，你已成功加入${group}组`;
                    break;
                case Step.组面时间选择:
                case Step.群面时间选择:
                    defaultRest = '，请进入选手dashboard系统选择面试时间';
                    break;
                default:
                    throw new Error('Next step is invalid!');
            }
            if (current === undefined) throw new Error('Current step is not provided!');
            rest = `${rest || defaultRest}${suffix}`;
            // {1}你好，你通过了{2}{3}组{4}审核{5}
            return {
                template: SMS_TEMPLATE_MAP.get(SMSTemplateType.Pass)!,
                params: [name, recruitmentName, group, STEP_MAP.get(current)!, rest],
            };
        }
        case SMSType.reject: {
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            if (current === undefined) throw new Error('Current step is not provided!');
            rest = `${rest || defaultRest}${suffix}`;
            // {1}你好，你没有通过{2}{3}组{4}审核，请你{5}
            return {
                template: SMS_TEMPLATE_MAP.get(SMSTemplateType.Delay)!,
                params: [name, recruitmentName, group, STEP_MAP.get(current)!, rest],
            };
        }
    }
};
