export default (accepted: boolean, name: string, title: string, group: string, step: string) => {
    if (step === '通过' && accepted) {
        return `[联创团队]${name}你好，你在${title}中已成功加入${group}组！`
    }
    return accepted ?
        `[联创团队]${name}你好，你通过了${title}${group}组${step}审核${step === '笔试流程' || step === '熬测流程' ? '，请进入以下链接选择面试时间' : ''}`
        : `[联创团队]${name}你好，你没有通过${title}${group}组${step}审核`
}