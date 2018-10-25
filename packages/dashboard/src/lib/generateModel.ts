import { STEPS } from './const';

interface Model {
    accepted: boolean;
    name?: string;
    title?: string;
    group?: string;
    step: string;
    time?: string;
    place?: string;
    rest?: string;
}

export default ({ accepted, name = '{{候选人姓名}}', title = '{{招新名称}}', group = '{{组别}}', step, time, place, rest }: Model) => {
    const generateRest = () => {
        if (!accepted) {
            return `，请你不要灰心，继续学习。期待与更强大的你的相遇！`;
        }
        switch (step) {
            case STEPS[1]:
            case STEPS[3]:
                return `，请进入以下链接选择面试时间：`;
            case STEPS[0]:
                return `，请于${time}在${place}参加${STEPS[1]}，请务必准时到场`;
            case STEPS[2]:
                return `，请于${time}在${place}参加${STEPS[3]}，请务必准时到场`;
            case STEPS[4]:
                return `，你已成功加入${group}组`;
            default:
                return '';
        }
    };
    rest = rest || generateRest();
    return `[联创团队]${name}你好，你${accepted ? '通过了' : '没有通过'}${title}${group}组${step}审核${rest}`;
};
