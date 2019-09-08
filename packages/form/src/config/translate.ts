export default (msg: string): string => {
    switch (msg) {
        case 'Form doesn\'t exist!':
        case 'URL is invalid!':
            return '表单不存在，请检查URL信息';
        case 'Recruitment doesn\'t exist!':
        case 'This recruitment has already ended!':
            return '招新不存在，请联系管理员';
        case 'Candidate doesn\'t exist!':
            return '候选人不存在';
        case 'You have already abandoned!':
            return '你已经放弃了';
        case 'You are already rejected!':
            return '你已经被拒绝了';
        case 'Interview time is invalid!':
            return '面试时间错误';
        case 'You have already submitted!':
            return '你已经提交过了';
        default:
            return '操作失败，请重试';
    }
};
