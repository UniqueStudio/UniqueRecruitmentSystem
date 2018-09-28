import { STEPS } from './const';

export default (accepted: boolean, name: string, title: string, group: string, step: string, time?: string, place?: string, rest?: string) => {
    rest = rest ? rest : step === STEPS[1] || step === STEPS[3] ? `，请进入以下链接选择面试时间：`
        : step === STEPS[0] ? `，请于${time}在${place}参加${STEPS[1]}，请务必准时到场`
            : step === STEPS[2] ? `，请于${time}在${place}参加${STEPS[3]}，请务必准时到场`
                : step === STEPS[4] ? `，你已成功加入${group}组`
                    : '';
    if (step === '通过' && accepted) {
        return `[联创团队]${name}你好，你在${title}中已成功加入${group}组！`
    }
    return accepted ?
        `[联创团队]${name}你好，你通过了${title}${group}组${step}审核${rest}`
        : `[联创团队]${name}你好，你没有通过${title}${group}组${step}审核，请你不要灰心，继续学习。期待与更强大的你的相遇！`
}