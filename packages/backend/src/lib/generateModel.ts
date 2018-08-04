export const generateModel = (name: string, step: string, type: string, group: string) => {
    if (step === '通过' && type === 'accept') {
        return `${name}你好，你在2018年秋季招新中已成功加入${group}组！`
    }
    return type === 'accept' ?
        `${name}你好，你通过了2018年秋季招新${group}组${step}审核${step === '笔试流程' || step === '熬测流程' ? '，请进入以下链接选择面试时间' : ''}`
        : `${name}你好，你没有通过2018年秋季招新${group}组${step}审核`
};