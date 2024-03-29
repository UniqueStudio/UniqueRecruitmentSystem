import { STEP_MAP } from '@config/consts';
import { SMSType, Step } from '@config/enums';
import { SMSTemplate } from '@config/types';

export const applySMSTemplate = ({ type, time, place, meetingId, rest, current, next }: SMSTemplate) => {
    const prefix = '[联创团队]{{候选人姓名}}你好，';
    // don't use default parameter because time and place may be empty string
    time = time || '{{!请指定时间!}}';
    place = place || '{{!请指定地点!}}';
    meetingId = meetingId || '{{!请指定会议号!}}';
    switch (type) {
        case SMSType.accept: {
            switch (next) {
                case Step.组面:
                    return `${prefix}请于{{时间}}在启明学院亮胜楼${place}参加组面，请准时到场`;
                case Step.在线组面:
                    return `${prefix}欢迎参加{{招新名称}}之{{组别}}组在线组面，面试将于${time}进行，请在PC端点击腾讯会议参与面试，会议号${meetingId}，并提前调试好摄像头和麦克风，祝你面试顺利。`;
                case Step.群面:
                    return `${prefix}请于{{时间}}在启明学院亮胜楼${place}参加群面，请准时到场`;
                case Step.在线群面:
                    return `${prefix}欢迎参加{{招新名称}}之{{组别}}组在线群面，面试将于${time}进行，请在PC端点击腾讯会议参与面试，会议号${meetingId}，并提前调试好摄像头和麦克风，祝你面试顺利。`;
                case Step.笔试:
                case Step.熬测:
                    rest = rest || `，请于${time}在${place}参加${STEP_MAP.get(next)!}，请务必准时到场`;
                    break;
                case Step.通过:
                    rest = rest || '，你已成功加入{{组别}}组';
                    break;
                case Step.组面时间选择:
                case Step.群面时间选择:
                    rest = rest || '，请进入选手dashboard系统选择面试时间';
                    break;
                default:
                    return '{{!请指定下一轮!}}';
            }
            return `${prefix}你通过了{{招新名称}}{{组别}}组${
                STEP_MAP.get(current!) ?? '{{!请指定当前流程!}}'
            }审核${rest}`;
        }
        case SMSType.reject: {
            rest = rest || '不要灰心，继续学习。期待与更强大的你的相遇！';
            return `${prefix}你没有通过{{招新名称}}{{组别}}组${
                STEP_MAP.get(current!) ?? '{{!请指定当前流程!}}'
            }审核，请你${rest}`;
        }
    }
};
