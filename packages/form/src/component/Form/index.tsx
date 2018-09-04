import * as React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import Input from '../Input';
import Choose from '../Choose';
import Select from '../Select';
import { GRADES, GROUPS, SCORES, URL } from '../../const';
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
            isQuick: '0'
        },
        submitted: false,
        snackBarOn: false,
        content: '',
        open: '',
        sent: false,
        time: 0
    };

    interval = NaN;

    checkMail = (mail: string) => {
        const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(mail);
    };

    checkPhone = (phone: string) => {
        const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
        return re.test(phone);
    };

    checkChinese = (data: string) => {
        const re = /^([\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+$/;
        return re.test(data);
    };

    handleClick = () => {
        const info = { title: '2018A', ...this.state.info };
        const translator = {
            name: '姓名',
            mail: '邮箱',
            institute: '学院',
            major: '专业',
            sex: '性别',
            grade: '年级',
            group: '组别',
            score: '成绩排名',
            phone: '电话号码',
            code: '验证码',
            intro: '自我介绍',
        };
        for (const i of Object.entries(info)) {
            if (i[1] === '' && i[0] !== 'resume') {
                this.setState({
                    snackBarOn: true,
                    content: `请填写${translator[i[0]]}`
                });
                return;
            }
        }
        if (!this.checkChinese(info.name)) {
            this.setState({
                snackBarOn: true,
                content: '姓名必须为中文!'
            });
            return;
        }
        if (!this.checkChinese(info.institute)) {
            this.setState({
                snackBarOn: true,
                content: '学院必须为中文!'
            });
            return;
        }
        if (!this.checkChinese(info.major)) {
            this.setState({
                snackBarOn: true,
                content: '专业必须为中文!'
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
        info.group = info.group.toLowerCase();
        const formData = new FormData();
        Object.entries(info).map(i => formData.append(i[0], i[1]));
        (async () => {
            try {
                const response = await fetch(`${URL}/candidates`, {
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

    handleCheck = (e: React.ChangeEvent) => {
        this.setState({ info: { ...this.state.info, isQuick: e.target['checked'] ? '1' : '0' } });
    };

    handleFile = (event: React.ChangeEvent) => {
        const file = event.target['files'][0];
        event.target['value'] = null;
        if (!file) {
            this.setState({
                snackBarOn: true,
                content: '你没有上传任何文件'
            });
            return;
        }
        if (file.size > 1024 * 1024 * 100) {
            this.setState({
                snackBarOn: true,
                content: '文件大小必须小于100MB'
            });
            return;
        }
        this.setState({
            info: { ...this.state.info, resume: file }
        })
    };

    handleClose = () => {
        this.setState({
            snackBarOn: false,
            content: ''
        })
    };

    getVerification = () => {
        (async () => {
            try {
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
                const response = await fetch(`${URL}/verification/candidate/${phone}`);
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
                    this.interval = window.setInterval(() => {
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
                } else {
                    this.setState({
                        snackBarOn: true,
                        content: '获取验证码失败'
                    });
                }
            } catch (err) {
                this.setState({
                    snackBarOn: true,
                    content: '无法预知的错误'
                });
            }
        })()

    };

    handleToggle = (name: string) => {
        this.setState({
            open: this.state.open === name ? '' : name
        })
    };

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    public render() {
        const { submitted, content, snackBarOn, info, sent, time } = this.state;
        const { isMobile } = this.props;
        const canGetCode = this.checkPhone(info.phone);
        const Name = <Input for='name' size='md' name='姓名' onChange={this.handleChange}
                            className={classNames({ mobile_sm: isMobile })} />;
        const Mail = <Input for='mail' size='md' name='邮箱' onChange={this.handleChange} />;
        const Institute = <Input for='institute' size='md' name='学院' onChange={this.handleChange} />;
        const Major = <Input for='major' size='md' name='专业' onChange={this.handleChange} />;
        const Sex = (
            <div className='formRow choose'>
                <Choose onChange={this.handleChange('sex')} />
            </div>
        );
        const Grade = <Select selections={GRADES} name='所属年级' onChange={this.handleChange('grade')} onToggle={() => this.handleToggle('grade')} open={this.state.open === 'grade'} />;
        const Group = <Select selections={GROUPS} name='组别选择' onChange={this.handleChange('group')} onToggle={() => this.handleToggle('group')} open={this.state.open === 'group'} />;
        const Score = <Select selections={SCORES} name='成绩排名' onChange={this.handleChange('score')} onToggle={() => this.handleToggle('score')} open={this.state.open === 'score'} />;
        const Phone = <Input for='phone' size='ml' name='电话' onChange={this.handleChange} />;
        const CodeButton = <Button name={sent ? `${time}秒后${isMobile ? '重新获取' : '重获'}` : '接收验证码'}
                                   bgColor={canGetCode ? 'primary' : 'primaryLighter'}
                                   textColor={canGetCode ? 'white' : 'primary'}
                                   onClick={sent || !canGetCode ? undefined : this.getVerification}
                                   className={classNames({ disabled: sent || !canGetCode }, { codeButton: !isMobile })} />;
        const Code = <Input for='code' size='sm' name='验证码' onChange={this.handleChange}
                            className={classNames({ mobile_sm: isMobile })} />;
        const Resume = (
            <>
                <input id='resume' name='resume' type='file' className='none'
                       onChange={this.handleFile} />
                <label htmlFor='resume'>
                    <span className={classNames(
                        info.resume ? 'background_primary' : 'background_primaryLighter',
                        info.resume ? 'text_white' : 'text_primary',
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
        const Quick = (
            <div className='quick'>
                <input type="checkbox" id="quick" name="quick" onChange={this.handleCheck}/>
                <label htmlFor="quick"><div className='checker'/>我想要走快速通道（要求很高，请慎重勾选）</label>
            </div>
        );
        const Submit = (
            <div className='submit'>
                <Button name='提交' bgColor='secondary' textColor='white' onClick={this.handleClick} />
            </div>
        );
        const Intro = <TextArea onChange={this.handleChange('intro')} />;
        const PCInterface = (
            <>
                <div className='gridWrapper'>
                    <div className='name'>{Name}</div>
                    <div className='mail'>{Mail}</div>
                    <div className='institute'>{Institute}</div>
                    <div className='major'>{Major}</div>
                    <div className='sex'>{Sex}</div>
                    <div className='phone'>
                        <div className='codeBox'>
                            {Phone}{CodeButton}
                        </div>
                    </div>
                    <div className='code'>{Code}</div>
                    <div className='grade'>{Grade}</div>
                    <div className='group'>{Group}</div>
                    <div className='score'>{Score}</div>
                    <div className='resume'>{Resume}</div>
                    <div className='intro'>{Intro}{Quick}</div>
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
                    {Quick}
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
