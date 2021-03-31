import { STEP_MAP } from '@config/consts';
import { SMSType, Step } from '@config/enums';

interface Model {
    type: SMSType;
    step: Step;
    next: Step;
    time?: string;
    place?: string;
    rest?: string;
}

export const generateModel = ({ type, time = '{{时间}}', place = '{{地点}}', rest, next, step }: Model) => {
    const prefix = '[联创团队]{{候选人姓名}}你好，';
    switch (type) {
        case SMSType.accept: {
            let defaultRest = '';
            switch (next) {
                case Step.组面:
                    return `${prefix}请于{{时间(默认)}}在启明学院亮胜楼${place}参加组面，请准时到场`;
                case Step.群面:
                    return `${prefix}请于{{时间(默认)}}在启明学院亮胜楼${place}参加群面，请准时到场`;
                case Step.笔试:
                case Step.熬测:
                    defaultRest = `，请于${time}在${place}参加${STEP_MAP.get(next) || '{{下一流程}}'}，请务必准时到场`;
                    break;
                case Step.通过:
                    defaultRest = '，你已成功加入{{组别}}组';
                    break;
                case Step.组面时间选择:
                case Step.群面时间选择:
                    defaultRest = '，请进入选手dashboard系统选择面试时间';
                    break;
            }
            rest = rest || defaultRest;
            return `${prefix}你通过了{{招新名称}}{{组别}}组${STEP_MAP.get(step) || '{{xx流程}}'}审核${rest}`;
        }
        case SMSType.reject: {
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            rest = rest || defaultRest;
            return `${prefix}你没有通过{{招新名称}}{{组别}}组${STEP_MAP.get(step) || '{{xx流程}}'}审核，请你${rest}`;
        }
    }
};
