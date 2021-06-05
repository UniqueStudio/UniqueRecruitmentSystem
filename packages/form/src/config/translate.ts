export default (msg: string): string => {
    switch (msg) {
        case 'No pending recruitment!':
            return '招新未开启';
        case "Form doesn't exist!":
        case 'URL is invalid!':
            return '表单不存在，请检查URL信息';
        case "Recruitment doesn't exist!":
        case 'This recruitment has already ended!':
            return '招新不存在，请联系管理员';
        case "Candidate doesn't exist!":
            return '候选人不存在';
        case 'You have already abandoned!':
            return '你已经放弃了';
        case 'You are already rejected!':
            return '你已经被拒绝了';
        case 'Interview time is invalid!':
            return '面试时间错误';
        case 'You have already submitted!':
            return '你已经提交过了';
        case 'You have already applied!':
            return '你已经成功报名了';
        case 'Validation code is incorrect!':
            return '验证码错误';
        case 'Name is invalid!':
            return '请填写名字';
        case 'Mail is invalid!':
            return '请正确填写邮箱';
        case 'Grade is invalid!':
            return '请选择年级';
        case 'Institute is invalid!':
            return '请填写学院';
        case 'Major is invalid!':
            return '请填写专业';
        case 'Gender is invalid!':
            return '请选择性别';
        case 'Phone is invalid!':
            return '电话号码错误';
        case 'Group is invalid!':
            return '请选择要报名的组别';
        case 'Rank is invalid!':
            return '请选择成绩排名';
        case 'Intro is invalid!':
            return '请填写自我介绍';
        case 'Signing up Design team needs works':
            return '填报Design组需要上交作品集';
        default:
            return '操作失败，请重试';
    }
};
