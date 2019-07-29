import React, { PureComponent } from 'react';

import classNames from 'classnames';
import { GENDERS, GRADES, GROUPS, MEDIA, RANKS, URL } from '../../config/const';
import { Departments } from '../../config/department';
import { Candidate, Variant } from '../../config/types';
import { upload } from '../../utils/upload';
import { checkMail, checkPhone } from '../../utils/validators';
import AutoSuggest from '../AutoSuggest';
import Button from '../Button';
import Input from '../Input';
// import Popover from '../Popover';
import Select from '../Select';
import Submitted from '../Submitted';
import TextArea from '../TextArea';

interface Props {
    media: MEDIA;
    isMobile: boolean;
    submit: () => void;
    toggleSnackbar: (content: string, variant: Variant) => void;
    title: string;
}

class Form extends PureComponent<Props> {
    state = {
        info: { referrer: '', resume: '', isQuick: false } as Candidate,
        submitted: false,
        selecting: '',
        sent: false,
        popoverOn: false,
        time: 0,
        progress: 0
    };

    interval = (undefined as unknown) as number;

    handleSubmit = async () => {
        const { info: stateInfo } = this.state;
        const { title, toggleSnackbar } = this.props;
        const info = { ...stateInfo, group: (GROUPS[stateInfo.group] || '').toLowerCase(), title };
        const translator = {
            name: '姓名',
            mail: '邮箱',
            institute: '学院',
            major: '专业',
            gender: '性别',
            grade: '年级',
            group: '组别',
            score: '成绩排名',
            phone: '电话号码',
            code: '验证码',
            intro: '自我介绍'
        };
        for (const [key, value] of Object.entries(info)) {
            if (value === undefined) {
                return toggleSnackbar(`请填写${translator[key]}`, 'warning');
            }
        }
        if (!checkMail(info.mail)) {
            return toggleSnackbar('邮箱格式不正确!', 'warning');
        }
        if (!checkPhone(info.phone)) {
            return toggleSnackbar('手机号码格式不正确!', 'warning');
        }
        const formData = new FormData();
        Object.entries(info).map(([key, value]) => formData.append(key, value));
        try {
            info.resume && toggleSnackbar('开始上传，请耐心等待', 'info');
            const response = await upload(`${URL}/candidate`, { method: 'POST', body: formData }, ({ loaded, total }) =>
                this.setState({
                    progress: ((loaded / total) * 100).toFixed(1)
                })
            );
            const result = JSON.parse(response);
            if (result.type === 'success') {
                toggleSnackbar('提交成功', result.type);
                this.setState({
                    submitted: true,
                    progress: 0
                });
                this.props.submit();
            } else {
                toggleSnackbar(result.message, result.type);
                this.setState({
                    progress: 0
                });
            }
        } catch ({ message }) {
            toggleSnackbar(message, 'error');
            this.setState({
                progress: 0
            });
        }
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({ info: { ...this.state.info, [name]: e.target['value'] } });
    };

    handleSelect = (name: string) => (value: string | number) => () => {
        this.setState({ info: { ...this.state.info, [name]: value } });
    };

    handleCheck = () => {
        this.setState({ info: { ...this.state.info, isQuick: !this.state.info.isQuick } });
    };

    resetInput = ({ currentTarget }: React.MouseEvent<HTMLInputElement>) => {
        currentTarget.value = '';
    };

    handleFile = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
        const { toggleSnackbar } = this.props;
        if (!files) {
            return toggleSnackbar('你没有上传任何文件', 'warning');
        }
        const file = files[0];
        if (file.size > 1024 * 1024 * 100) {
            return toggleSnackbar('文件大小必须小于100MB', 'warning');
        }
        this.setState({
            info: { ...this.state.info, resume: file }
        });
    };

    getVerification = async () => {
        const { toggleSnackbar } = this.props;
        try {
            const { phone } = this.state.info;
            if (!phone) {
                return toggleSnackbar('请填写手机号码!', 'warning');
            }
            if (!checkPhone(phone)) {
                return toggleSnackbar('手机号码格式不正确!', 'warning');
            }
            const response = await fetch(`${URL}/sms/verification/candidate/${phone}`);
            const result = await response.json();
            if (result.type !== 'success') {
                return toggleSnackbar(result.message || '获取验证码失败!', result.type);
            }
            toggleSnackbar('验证码已发送!', result.type);
            this.setState({
                sent: true,
                time: 60
            });
            this.interval = window.setInterval(() => {
                if (this.state.time === 0) {
                    this.setState({
                        sent: false
                    });
                    clearInterval(this.interval);
                    return;
                }
                this.setState({
                    time: this.state.time - 1
                });
            }, 1000);
        } catch ({ message }) {
            toggleSnackbar(`无法预知的错误: ${message}`, 'error');
        }
    };

    handleToggle = (name: string) => () => {
        this.setState({
            selecting: this.state.selecting === name ? '' : name
        });
    };

    handlePop = () => {
        this.setState({
            popoverOn: !this.state.popoverOn
        });
    };

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        const { submitted, info, sent, time, /*popoverOn,*/ progress, selecting } = this.state;
        const { gender, phone, group, grade, rank, isQuick, institute, major } = info;
        const { isMobile } = this.props;
        const canGetCode = checkPhone(phone);

        const Institute = (
            <AutoSuggest
                id='学院'
                items={Object.keys(Departments)}
                value={institute || ''}
                getItemValue={(value) => value as string}
                onChange={this.handleChange('institute')}
                onSelect={(event, { suggestionValue }) =>
                    this.setState({ info: { ...this.state.info, institute: suggestionValue } })
                }
            />
        );

        const Major = (
            <AutoSuggest
                id='专业'
                items={Departments[institute] || []}
                value={major || ''}
                getItemValue={(value) => value as string}
                onChange={this.handleChange('major')}
                onSelect={(event, { suggestionValue }) =>
                    this.setState({ info: { ...this.state.info, major: suggestionValue } })
                }
            />
        );

        const Name = (
            <Input
                for='name'
                name='姓名'
                onChange={this.handleChange('name')}
                className={classNames({ mobile_sm: isMobile })}
            />
        );
        const Mail = <Input for='mail' name='邮箱' onChange={this.handleChange('mail')} />;
        // const Institute = <Input for='institute' name='学院' onChange={this.handleChange('institute')} />;
        // const Major = <Input for='major' name='专业' onChange={this.handleChange('major')} />;
        const Gender = (
            <Select
                selections={GENDERS}
                value={GENDERS[gender]}
                defaultValue='性别选择'
                handleSelect={this.handleSelect('gender')}
                onToggle={this.handleToggle('gender')}
                open={selecting === 'gender'}
            />
        );
        const Grade = (
            <Select
                selections={GRADES}
                value={GRADES[grade]}
                defaultValue='所属年级'
                handleSelect={this.handleSelect('grade')}
                onToggle={this.handleToggle('grade')}
                open={selecting === 'grade'}
            />
        );
        const Group = (
            <Select
                selections={GROUPS}
                value={GROUPS[group]}
                defaultValue='组别选择'
                handleSelect={this.handleSelect('group')}
                onToggle={this.handleToggle('group')}
                open={selecting === 'group'}
            />
        );
        const Rank = (
            <Select
                selections={RANKS}
                value={RANKS[rank]}
                defaultValue='成绩排名'
                handleSelect={this.handleSelect('rank')}
                onToggle={this.handleToggle('rank')}
                open={selecting === 'rank'}
            />
        );
        const Phone = <Input for='phone' name='电话' onChange={this.handleChange('phone')} />;
        const CodeButton = (
            <Button
                name={sent ? `${time}秒后${isMobile ? '重新获取' : '重获'}` : '接收验证码'}
                bgColor='primaryLighter'
                textColor='primary'
                onClick={sent || !canGetCode ? undefined : this.getVerification}
                className={classNames({ disabled: sent || !canGetCode })}
            />
        );
        const Code = (
            <Input
                for='code'
                name='验证码'
                onChange={this.handleChange('code')}
                className={classNames({ mobile_sm: isMobile })}
            />
        );
        const Resume = (
            <>
                <input
                    id='resume'
                    name='resume'
                    type='file'
                    className='none'
                    onChange={this.handleFile}
                    onClick={this.resetInput}
                />
                <label htmlFor='resume'>
                    <span
                        className={classNames(
                            info.resume ? 'background_primary' : 'background_primaryLighter',
                            info.resume ? 'text_white' : 'text_primary',
                            'fontSize',
                            'button',
                            'contentPadding',
                            'fileButton'
                        )}
                    >
                        {info.resume && progress ? `上传中: ${progress}%` : '上传简历/作品集'}
                    </span>
                </label>
            </>
        );
        const Referrer = (
            <Input
                for='referrer'
                name='推荐人'
                placeholder='无'
                onChange={this.handleChange('referrer')}
                className={classNames({ mobile_sm: isMobile })}
            />
        );
        const Quick = (
            <Button
                name='快速通道'
                bgColor={isQuick ? 'primary' : 'primaryLighter'}
                textColor={isQuick ? 'white' : 'primary'}
                onClick={this.handleCheck}
                className={classNames({ widthFull: !isMobile })}
            />
        );
        const Submit = (
            <div className='submit'>
                <Button name='提交' bgColor='secondary' textColor='white' onClick={this.handleSubmit} />
            </div>
        );
        const Intro = <TextArea onChange={this.handleChange('intro')} />;
        const PCInterface = (
            <>
                <div className='gridWrapper'>
                    <div className='name'>{Name}</div>
                    <div className='institute'>{Institute}</div>
                    <div className='major'>{Major}</div>
                    <div className='referrer'>{Referrer}</div>
                    <div className='mail'>{Mail}</div>
                    <div className='phone'>{Phone}</div>
                    <div className='codeButton'>{CodeButton}</div>
                    <div className='code'>{Code}</div>
                    <div className='gender'>{Gender}</div>
                    <div className='group'>{Group}</div>
                    <div className='grade'>{Grade}</div>
                    <div className='score'>{Rank}</div>
                    <div className='resume'>{Resume}</div>
                    <div className='quick'>{Quick}</div>
                    <div className='intro'>{Intro}</div>
                </div>
                {Submit}
            </>
        );

        const MobileInterface = (
            <>
                <div className='form'>
                    {Name}
                    {Gender}
                    {Group}
                    {Grade}
                    {Rank}
                    {Institute}
                    {Major}
                    {Mail}
                    {Phone}
                    {CodeButton}
                    {Code}
                    {Referrer}
                    {Resume}
                    {Quick}
                    {Intro}
                    {Submit}
                </div>
            </>
        );

        return (
            <div className='formContainer'>
                {!submitted && (!isMobile ? PCInterface : MobileInterface)}
                {submitted && (
                    <Submitted
                        title='报名成功'
                        description='请等待我们的短信通知，有问题可在招新群联系我们'
                        className='fullHeight'
                    />
                )}
            </div>
        );
    }
}

export default Form;
