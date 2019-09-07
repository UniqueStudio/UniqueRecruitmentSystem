import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import hlogo from '../../asset/img/hlogo.png';
import { GENDERS, GRADES, GROUPS, RANKS, URL } from '../../config/const';
import { Departments } from '../../config/department';
import { Candidate, Variant } from '../../config/types';
import styles from '../../style/Form';
import { sizeSwitch } from '../../utils/sizeSwitch';
import { upload } from '../../utils/upload';
import { checkMail, checkPhone } from '../../utils/validators';
import AutoSuggest from '../AutoSuggest';
import Button from '../Button';
import Input from '../Input';
// import Popover from '../Popover';
import Select from '../Select';
import Submitted from '../Submitted';
import TextArea from '../TextArea';
import UploadProgress from '../UploadProgress';

interface Props extends WithStyles<typeof styles> {
    isPC: boolean;
    isPad: boolean;
    isMobile: boolean;
    submit: () => void;
    toggleSnackbar: (content: string, variant: Variant) => void;
    title: string;
}

class Form extends PureComponent<Props> {
    state = {
        info: { referrer: '', resume: '', isQuick: false } as Candidate,
        submitted: false,
        sent: false,
        popoverOn: false,
        time: 0,
        progress: 0,
        submitting: false
    };

    focusFile = React.createRef<HTMLInputElement>();

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
            this.setState({ submitting: true });
            info.resume && toggleSnackbar('开始上传，请耐心等待', 'info');
            const response = await upload(`${URL}/candidate`, { method: 'POST', body: formData }, ({ loaded, total }) =>
                this.setState({
                    progress: ((loaded / total) * 100).toFixed(1)
                })
            );
            const result = JSON.parse(response);
            if (result.type === 'success') {
                toggleSnackbar('提交成功', result.type);
                this.setState({ submitted: true });
                this.props.submit();
            } else {
                toggleSnackbar(result.message, result.type);
            }
        } catch ({ message }) {
            toggleSnackbar(message, 'error');
        } finally {
            this.setState({ progress: 0, submitting: false });
        }
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({ info: { ...this.state.info, [name]: e.target['value'] } });
    };

    handleSelect = (name: string) => (value: number) => {
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

    handleFileFocus = ({ which }: React.KeyboardEvent<HTMLSpanElement>) => {
        if (which === 13 || which === 32) {
            if (this.focusFile.current) {
                this.focusFile.current.click();
            }
        }
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

    handlePop = () => {
        this.setState({
            popoverOn: !this.state.popoverOn
        });
    };

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        const { submitted, info, sent, time, /*popoverOn,*/ progress, submitting } = this.state;
        const { gender, phone, group, grade, rank, isQuick, institute, major } = info;
        const { isPC, isPad, isMobile, classes } = this.props;
        const canGetCode = checkPhone(phone);
        let main: JSX.Element = <></>;
        const Institute = (
            <AutoSuggest<string>
                id='学院'
                items={Object.keys(Departments) as string[]}
                value={institute || ''}
                size={sizeSwitch({ 15: isPC, 21: isPad, 65: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
                getItemValue={(value: string) => value}
                onChange={this.handleChange('institute')}
                onSelect={(event, { suggestionValue }) =>
                    this.setState({ info: { ...this.state.info, institute: suggestionValue } })
                }
            />
        );
        const Major = (
            <AutoSuggest<string>
                id='专业'
                items={Departments[institute] || []}
                value={major || ''}
                size={sizeSwitch({ 15: isPC, 21: isPad, 65: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
                getItemValue={(value: string) => value}
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
                size={sizeSwitch({ 6: isPC, 8: isPad, 20: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            />
        );
        const Referrer = (
            <Input
                for='referrer'
                name='推荐人'
                placeholder='无'
                onChange={this.handleChange('referrer')}
                size={sizeSwitch({ 6: isPC, 8: isPad, 20: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            />
        );
        const Mail = (
            <Input
                for='mail'
                name='邮箱'
                onChange={this.handleChange('mail')}
                size={sizeSwitch({ 16: isPC, 24: isPad, 65: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            />
        );
        const Phone = (
            <Input
                for='phone'
                name='电话'
                onChange={this.handleChange('phone')}
                size={sizeSwitch({ 15: isPC, 21: isPad, 65: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            />
        );
        const Code = (
            <Input
                for='code'
                name='验证码'
                onChange={this.handleChange('code')}
                size={sizeSwitch({ 6: isPC, 8: isPad, 20: isMobile })}
                labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            />
        );

        const selectComponents = ([
            ['性别选择', 'gender', GENDERS, gender],
            ['所属年级', 'grade', GRADES, grade],
            ['组别选择', 'group', GROUPS, group],
            ['成绩排名', 'rank', RANKS, rank]
        ] as [string, string, string[], number][]).map(v => {
            return (
                <Select
                    key={v[1]}
                    selections={v[2]}
                    value={v[2][v[3]] || ''}
                    defaultValue={v[0]}
                    handleSelect={this.handleSelect(v[1])}
                />
            );
        });

        const CodeButton = (
            <Button
                name={sent ? `${time}秒后${isMobile ? '重新获取' : '重获'}` : '接收验证码'}
                bgColor='primaryLighter'
                textColor='primary'
                onClick={sent || !canGetCode ? undefined : this.getVerification}
                className={classNames({ disabled: sent || !canGetCode })}
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

        const Resume = (
            <div>
                <label htmlFor='resume'>
                    <span
                        className={classNames(
                            info.resume ? 'background_primary' : 'background_primaryLighter',
                            info.resume ? 'text_white' : 'text_primary',
                            classes.border,
                            classes.font,
                            classes.resume,
                            classes.height,
                            'button'
                        )}
                        tabIndex={0}
                        onKeyDown={this.handleFileFocus}
                    >
                        {info.resume && progress ? `上传中: ${progress}%` : '上传简历/作品集'}
                    </span>
                    <input
                        id='resume'
                        name='resume'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={this.handleFile}
                        onClick={this.resetInput}
                        ref={this.focusFile}
                    />
                </label>
            </div>
        );

        (isPC || isPad) &&
            (main = (
                <>
                    <div className={classes.partOne}>
                        {Name}
                        {Mail}
                        {Referrer}
                    </div>
                    <div className={classes.partTwo}>
                        <div className='ptLeft'>
                            {Institute}
                            {Major}
                        </div>
                        <div className='ptMid'>
                            <img src={hlogo} />
                        </div>
                        <div className='ptRight'>
                            {Phone}
                            <div className='codeBar'>
                                {Code}
                                {CodeButton}
                            </div>
                        </div>
                    </div>
                    <div className={classes.partThree}>{selectComponents}</div>
                    <div className={classes.partFour}>
                        <div className='pfLeft'>{Intro}</div>
                        <div className='pfRight'>
                            {Resume}
                            {Quick}
                            {Submit}
                        </div>
                    </div>
                </>
            ));

        isMobile &&
            (main = (
                <>
                    <div>
                        {Name}
                        {Referrer}
                    </div>
                    <div>{Mail}</div>
                    <div>{Institute}</div>
                    <div>{Major}</div>
                    <div className='mobile-select'>{selectComponents}</div>
                    <div>
                        {Resume}
                        {Quick}
                    </div>
                    <div>{Intro}</div>
                    <div>{Phone}</div>
                    <div>
                        {Code}
                        {CodeButton}
                    </div>
                    <div className='mobile-submit'>{Submit}</div>
                </>
            ));

        return (
            <div className={classes.root}>
                <div
                    className={classNames(classes.container, {
                        [classes.curtain]: (submitted || submitting) && !isMobile
                    })}
                >
                    {main}
                </div>
                {submitted && (
                    <Submitted title='报名成功' description='请等待我们的短信通知，有问题可在招新群联系我们' />
                )}
                {submitting && <UploadProgress progress={progress} />}
            </div>
        );
    }
}

export default withStyles(styles)(Form);
