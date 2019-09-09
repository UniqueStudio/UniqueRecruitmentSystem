import React, { ChangeEvent, FC, KeyboardEvent, memo, MouseEvent, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import hlogo from '../../asset/img/hlogo.png';
import { GENDERS, GRADES, GROUPS, RANKS, URL } from '../../config/const';
import { Departments } from '../../config/department';
import translate from '../../config/translate';
import { Candidate, Variant } from '../../config/types';
import useStyles from '../../style/Form';
import { sizeSwitch } from '../../utils/sizeSwitch';
import { upload } from '../../utils/upload';
import { checkMail, checkPhone } from '../../utils/validators';
import AutoSuggest from '../AutoSuggest';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Submitted from '../Submitted';
import TextArea from '../TextArea';
import UploadProgress from '../UploadProgress';

interface FormProps {
    isPC: boolean;
    isPad: boolean;
    isMobile: boolean;
    submit: () => void;
    toggleSnackbar: (content: string, variant: Variant) => void;
    title: string;
}

const translator = new Map([
    ['name', '姓名'],
    ['mail', '邮箱'],
    ['institute', '学院'],
    ['major', '专业'],
    ['gender', '性别'],
    ['grade', '年级'],
    ['group', '组别'],
    ['score', '成绩排名'],
    ['phone', '电话号码'],
    ['code', '验证码'],
    ['intro', '自我介绍']
]);

const Form: FC<FormProps> = memo(props => {
    const classes = useStyles();
    const { isPC, isPad, isMobile, title, submit, toggleSnackbar } = props;

    const [formInfo, setFormInfo] = useState<Candidate>({ referrer: '', resume: '', isQuick: false } as Candidate);
    const [submitState, setSubmitState] = useState({ submitted: false, submitting: false });
    const [code, setCode] = useState({ time: 0, sent: false });
    const [progress, setProgress] = useState<number>(0);
    const [interval, setCodeInterval] = useState<number>(0);
    const resumeFocus = useRef<HTMLInputElement>(null);

    const { gender, phone, group, grade, rank, isQuick, institute, major, resume } = formInfo;
    const canGetCode = checkPhone(phone);

    useEffect(() => {
        return () => window.clearInterval(interval);
    }, [interval]);

    const handleSubmit = async () => {
        const info = { ...formInfo, group: (GROUPS[group] || '').toLowerCase(), title };
        if (!checkMail(info.mail)) {
            return toggleSnackbar('邮箱格式不正确!', 'warning');
        }
        if (!checkPhone(info.phone)) {
            return toggleSnackbar('手机号码格式不正确!', 'warning');
        }
        const formData = new FormData();
        for (const [key, value] of Object.entries(info)) {
            if (value === undefined) {
                return toggleSnackbar(`请填写${translator.get(key)}`, 'warning');
            }
            formData.append(key, value);
        }
        try {
            setSubmitState(({ submitted }) => ({ submitted, submitting: true }));
            info.resume && toggleSnackbar('开始上传，请耐心等待', 'info');
            const response = await upload(`${URL}/candidate`, { method: 'POST', body: formData }, ({ loaded, total }) =>
                setProgress(Number.parseFloat(((loaded / total) * 100).toFixed(1)))
            );
            const result = JSON.parse(response);
            if (result.type === 'success') {
                toggleSnackbar('提交成功', result.type);
                setSubmitState({ submitted: true, submitting: false });
                submit();
            } else {
                toggleSnackbar(translate(result.message), result.type);
                setSubmitState({ submitted: false, submitting: false });
            }
        } catch ({ message }) {
            toggleSnackbar(translate(message), 'error');
            setSubmitState({ submitted: false, submitting: false });
        } finally {
            setProgress(0);
        }
    };

    const handleChangeFormInfo = (name: string) => (value: unknown) => setFormInfo(pre => ({ ...pre, [name]: value }));

    const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChangeFormInfo(name)(e.target.value);

    const resetInput = ({ currentTarget }: MouseEvent<HTMLInputElement>) => {
        currentTarget.value = '';
    };

    const handleFile = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files) {
            return toggleSnackbar('你没有上传任何文件', 'warning');
        }
        const file = files[0];
        if (file.size > 1024 * 1024 * 100) {
            return toggleSnackbar('文件大小必须小于100MB', 'warning');
        }
        setFormInfo(pre => ({ ...pre, resume: file }));
    };

    const handleFileFocus = ({ which }: KeyboardEvent<HTMLSpanElement>) => {
        if (which === 13 || which === 32) {
            if (resumeFocus.current) {
                resumeFocus.current.click();
            }
        }
    };

    const getVerification = async () => {
        try {
            if (!phone) {
                return toggleSnackbar('请填写手机号码!', 'warning');
            }
            if (!checkPhone(phone)) {
                return toggleSnackbar('手机号码格式不正确!', 'warning');
            }
            setCode({ sent: true, time: 60 });
            setCodeInterval(
                window.setInterval(() => {
                    setCode(({ time, sent }) => {
                        if (time === 0) {
                            clearInterval(interval);
                            return { time: 0, sent: false };
                        }
                        return { time: time - 1, sent };
                    });
                }, 1000)
            );
            const response = await fetch(`${URL}/sms/verification/candidate/${phone}`);
            const result = await response.json();
            if (result.type !== 'success') {
                return toggleSnackbar(result.message || '获取验证码失败!', result.type);
            }
            toggleSnackbar('验证码已发送!', result.type);
        } catch ({ message }) {
            toggleSnackbar(`无法预知的错误: ${message}`, 'error');
        }
    };
    // components below
    let main = <></>;

    const Institute = (
        <AutoSuggest<string>
            id='学院'
            items={Object.keys(Departments) as string[]}
            value={institute || ''}
            size={sizeSwitch({ 15: isPC, 21: isPad, 65: isMobile })}
            labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
            getItemValue={(value: string) => value}
            onChange={handleChange('institute')}
            onSelect={(event, { suggestionValue }) => handleChangeFormInfo('institute')(suggestionValue)}
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
            onChange={handleChange('major')}
            onSelect={(event, { suggestionValue }) => handleChangeFormInfo('major')(suggestionValue)}
        />
    );

    const Name = (
        <Input
            for='name'
            name='姓名'
            onChange={handleChange('name')}
            size={sizeSwitch({ 6: isPC, 8: isPad, 20: isMobile })}
            labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
        />
    );
    const Referrer = (
        <Input
            for='referrer'
            name='推荐人'
            placeholder='无'
            onChange={handleChange('referrer')}
            size={sizeSwitch({ 6: isPC, 8: isPad, 20: isMobile })}
            labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
        />
    );
    const Mail = (
        <Input
            for='mail'
            name='邮箱'
            onChange={handleChange('mail')}
            size={sizeSwitch({ 16: isPC, 24: isPad, 65: isMobile })}
            labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
        />
    );
    const Phone = (
        <Input
            for='phone'
            name='电话'
            onChange={handleChange('phone')}
            size={sizeSwitch({ 15: isPC, 21: isPad, 65: isMobile })}
            labelSize={sizeSwitch({ 4: isPC, 6: isPad, 15: isMobile })}
        />
    );
    const Code = (
        <Input
            for='code'
            name='验证码'
            onChange={handleChange('code')}
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
                handleSelect={handleChangeFormInfo(v[1])}
            />
        );
    });

    const CodeButton = (
        <Button
            name={code.sent ? `${code.time}秒后${isMobile ? '重新获取' : '重获'}` : '接收验证码'}
            bgColor='primaryLighter'
            textColor='primary'
            onClick={code.sent ? undefined : getVerification}
            className={classNames({ disabled: code.sent || !canGetCode })}
        />
    );
    const Quick = (
        <Button
            name='快速通道'
            bgColor={isQuick ? 'primary' : 'primaryLighter'}
            textColor={isQuick ? 'white' : 'primary'}
            onClick={() => handleChangeFormInfo('isQuick')(!isQuick)}
        />
    );
    const Submit = (
        <div className='submit'>
            <Button name='提交' bgColor='secondary' textColor='white' onClick={handleSubmit} />
        </div>
    );
    const Intro = <TextArea onChange={handleChange('intro')} />;

    const Resume = (
        <div>
            <label htmlFor='resume'>
                <span
                    className={classNames(
                        resume ? 'background_primary' : 'background_primaryLighter',
                        resume ? 'text_white' : 'text_primary',
                        classes.border,
                        classes.font,
                        classes.resume,
                        classes.height,
                        'button'
                    )}
                    tabIndex={0}
                    onKeyDown={handleFileFocus}
                >
                    {resume && progress ? `上传中: ${progress}%` : '上传简历/作品集'}
                </span>
                <input
                    id='resume'
                    name='resume'
                    type='file'
                    style={{ display: 'none' }}
                    onChange={handleFile}
                    onClick={resetInput}
                    ref={resumeFocus}
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
                    [classes.curtain]: (submitState.submitted || submitState.submitting) && !isMobile
                })}
            >
                {main}
            </div>
            {submitState.submitted && (
                <Submitted title='报名成功' description='请等待我们的短信通知，有问题可在招新群联系我们' />
            )}
            {submitState.submitting && <UploadProgress progress={progress} />}
        </div>
    );
});

export default Form;
