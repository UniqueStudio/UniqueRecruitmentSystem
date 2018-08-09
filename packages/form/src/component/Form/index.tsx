import * as React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import Input from '../Input';
import Choose from '../Choose';
import Select from '../Select';
import { GRADES, GROUPS, SCORES } from '../../const';
import TextArea from '../TextArea';
import Submitted from '../Submitted';
import SnackBar from '../SnackBar';

interface Props {
    isMobile: boolean;
    submit: () => void;
}

class Form extends React.Component<Props> {
    state = {
        info: {
            name: '',
            mail: '',
            institute: '',
            major: '',
            sex: '',
            grade: '',
            group: '',
            score: '',
            phone: '',
            code: '',
            intro: '',
            resume: '',
        },
        submitted: false,
        snackBarOn: false,
        content: '',
        sent: false,
        time: 0
    };

    interval = null as any;

    checkMail = (mail: string) => {
        const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(mail);
    };

    checkPhone = (phone: string) => {
        const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
        return re.test(phone);
    };

    handleClick = () => {
        const info = { title: '2018A', ...this.state.info };
        if (Object.values(info).includes('')) {
            this.setState({
                snackBarOn: true,
                content: '请完整填写表单!'
            });
            return;
        }
        if (!this.checkMail(info.mail)) {
            this.setState({
                snackBarOn: true,
                content: '邮箱格式不正确!'
            });
            return;
        }
        if (!this.checkPhone(info.phone)) {
            this.setState({
                snackBarOn: true,
                content: '手机号码格式不正确!'
            });
            return;
        }
        info.grade = info.grade.replace('前', '');
        info.group = info.group.toLowerCase();
        const formData = new FormData();
        Object.entries(info).map(i => formData.append(i[0], i[1]));
        (async () => {
            try {
                const response = await fetch(`http://39.108.175.151:5000/candidates`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (result.type === 'success') {
                    localStorage.setItem('info', JSON.stringify(info));
                    this.setState({
                        submitted: true
                    });
                    this.props.submit();
                } else {
                    this.setState({
                        snackBarOn: true,
                        content: result.message
                    });
                    return;
                }
            } catch (err) {
                this.setState({
                    snackBarOn: true,
                    content: err.message
                });
            }
        })();
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({ info: { ...this.state.info, [name]: e.target['value'] } });
    };

    handleFile = (e: React.ChangeEvent) => {
        this.setState({
            info: { ...this.state.info, resume: e.target['files'][0] }
        })
    };

    handleClose = () => {
        this.setState({
            snackBarOn: false,
            content: ''
        })
    };

    getVerification = () => {
        try {
            (async () => {
                const phone = this.state.info.phone;
                if (!phone) {
                    this.setState({
                        snackBarOn: true,
                        content: '请填写手机号码!'
                    });
                    return;
                }
                if (!this.checkPhone(phone)) {
                    this.setState({
                        snackBarOn: true,
                        content: '手机号码格式不正确!'
                    });
                    return;
                }
                const response = await fetch(`http://39.108.175.151:5000/verification/candidate/${phone}`);
                const result = await response.json();
                if (result.type === 'success') {
                    this.setState({
                        snackBarOn: true,
                        content: '验证码已发送'
                    });
                    this.setState({
                        sent: true,
                        time: 60
                    });
                    this.interval = setInterval(() => {
                        if (this.state.time === 0) {
                            this.setState({
                                sent: false,
                            });
                            clearInterval(this.interval);
                            return;
                        }
                        this.setState({
                            time: this.state.time - 1
                        });
                    }, 1000);
                } else throw result;
            })()
        } catch (err) {
            this.setState({
                snackBarOn: true,
                content: err.message
            });
        }
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const { submitted, content, snackBarOn } = this.state;
        const { isMobile } = this.props;
        const Name = <Input for='name' size='md' name='姓名' onChange={this.handleChange}
                            className={classNames({ mobile_sm: isMobile })} />;
        const Mail = <Input for='mail' size='lg' name='邮箱' onChange={this.handleChange} />;
        const Institute = <Input for='institute' size='md' name='学院' onChange={this.handleChange} />;
        const Major = <Input for='major' size='md' name='专业' onChange={this.handleChange} />;
        const Sex = (
            <div className='formRow choose'>
                <Choose onChange={this.handleChange('sex')} />
            </div>
        );
        const Grade = <Select selections={GRADES} name='所属年级' onChange={this.handleChange('grade')} />;
        const Group = <Select selections={GROUPS} name='组别选择' onChange={this.handleChange('group')} />;
        const Score = <Select selections={SCORES} name='加权选择' onChange={this.handleChange('score')} />;
        const Phone = <Input for='phone' size='ml' name='电话' onChange={this.handleChange} />;
        const CodeButton = <Button name={this.state.sent ? `${this.state.time}秒后${isMobile ? '重新获取' : '重获'}` : '接受验证码'}
                                   bgColor='primaryLighter' textColor='primary'
                                   onClick={this.state.sent ? undefined : this.getVerification}
                                   className={classNames({ disabled: this.state.sent })} />;
        const Code = <Input for='code' size='sm' name='验证码' onChange={this.handleChange}
                            className={classNames({ mobile_sm: isMobile })} />;
        const Resume = (
            <>
                <input id='resume' name='resume' type='file' className='none'
                       onChange={this.handleFile} />
                <label htmlFor='resume'>
                    <span className={classNames(
                        'background_primaryLighter',
                        'text_primary',
                        'fontSize',
                        'button',
                        'contentPadding',
                        'fileButton'
                    )}>
                        上传简历/作品集
                    </span>
                </label>
            </>
        );
        const Submit = (
            <div className='submit'>
                <Button name='提交' bgColor='secondary' textColor='white' onClick={this.handleClick} />
            </div>
        );
        const Intro = <TextArea onChange={this.handleChange('intro')} />;
        const PCInterface = (
            <>
                <div className='form'>
                    <div className='formRow'>
                        {Name}
                        {Mail}
                        {Institute}
                        {Major}
                    </div>
                    <div className='formRow'>
                        {Sex}
                        <div className='formRow selects'>
                            {Grade}
                            {Group}
                            {Score}
                        </div>
                    </div>
                    <div className='formRow'>
                        <div className='formColumn'>
                            <div className='formRow rowItem'>
                                {Phone}
                                {CodeButton}
                            </div>
                            <div className='formRow rowItem'>
                                {Code}
                                {Resume}
                            </div>
                        </div>
                        <div className='formColumn'>
                            {Intro}
                        </div>
                    </div>
                </div>
                {Submit}
            </>
        );

        const MobileInterface = (
            <>
                <div className='titleContainer'>
                    <h1 className='title'>Unique Studio</h1>
                    <h1 className='title'>秋季招新</h1>
                </div>
                <div className='form'>
                    {Name}
                    {Sex}
                    {Mail}
                    {Institute}
                    {Major}
                    {Grade}
                    {Group}
                    {Score}
                    {Phone}
                    {CodeButton}
                    {Code}
                    <div className='formColumn'>
                        {Intro}
                    </div>
                    {Resume}
                    {Submit}
                </div>
            </>
        );

        return (
            <div className='formContainer'>
                {!submitted && (!isMobile ? PCInterface : MobileInterface)}
                {submitted &&
                <Submitted title='报名成功' description='请等待我们的短信通知，有问题可在招新群联系我们' className='fullHeight' />}
                {snackBarOn && <SnackBar content={content} onClose={this.handleClose} />}
            </div>
        );
    }
}

export default Form;
