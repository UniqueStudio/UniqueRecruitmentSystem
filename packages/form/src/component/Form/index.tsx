import * as React from 'react';
import Button from '../Button';
import Input from '../Input';
import Choose from '../Choose';
import Select from '../Select';
import { GRADES, GROUPS, SCORES } from '../../const';
import TextArea from '../TextArea';
import Submitted from '../Submitted';
import SnackBar from '../SnackBar';

class Form extends React.Component {
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
            //resume: '',
            intro: ''
        },
        submitted: false,
        snackBarOn: false,
        content: ''
    };

    checkMail = (mail: string) => {
        const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(mail);
    };

    checkPhone = (phone: string) => {
        const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
        return re.test(phone);
    };

    handleClick = () => {
        const info = { ...this.state.info };
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
        info['title'] = '2018A';
        fetch(`http://39.108.175.151:5000/candidates`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: { 'content-type': 'application/json' },
        })
            .then(res => res.json())
            .then(res => {
                if (res.type === 'success') {
                    localStorage.setItem('info', JSON.stringify(info));
                    this.setState({
                        submitted: true
                    })
                } else throw res;
            })
            .catch(err => {
                this.setState({
                    snackBarOn: true,
                    content: err.message
                });
            })
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({ info: { ...this.state.info, [name]: e.target['value'] } });
    };

    handleClose = () => {
        this.setState({
            snackBarOn: false
        })
    };

    public render() {
        return (
            <div className='formContainer'>
                {!this.state.submitted &&
                    <>
                        <div className='form'>
                            <div className='formRow'>
                                <Input for='name' size='md' name='姓名' onChange={this.handleChange} />
                                <Input for='mail' size='lg' name='邮箱' onChange={this.handleChange} />
                                <Input for='institute' size='md' name='学院' onChange={this.handleChange} />
                                <Input for='major' size='md' name='专业' onChange={this.handleChange} />
                            </div>
                            <div className='formRow'>
                                <div className='formRow choose'>
                                    <Choose onChange={this.handleChange('sex')} />
                                </div>
                                <div className='formRow selects'>
                                    <Select selections={GRADES} name='所属年级' onChange={this.handleChange('grade')} />
                                    <Select selections={GROUPS} name='组别选择' onChange={this.handleChange('group')} />
                                    <Select selections={SCORES} name='加权选择' onChange={this.handleChange('score')} />
                                </div>
                            </div>
                            <div className='formRow'>
                                <div className='formColumn'>
                                    <div className='formRow rowItem'>
                                        <Input for='phone' size='ml' name='手机号' onChange={this.handleChange} />
                                        <Button name='接受验证码' bgColor='primaryLighter' textColor='primary' />
                                    </div>
                                    <div className='formRow rowItem'>
                                        <Input for='code' size='sm' name='验证码' onChange={this.handleChange} />
                                        <Button name='上传简历/作品集' bgColor='primaryLighter' textColor='primary' />
                                    </div>
                                </div>
                                <div className='formColumn'>
                                    <TextArea onChange={this.handleChange('intro')} />
                                </div>
                            </div>
                        </div>
                        <div className='submit'>
                            <Button name='提交' bgColor='secondary' textColor='white' onClick={this.handleClick} />
                        </div>
                    </>
                }
                {this.state.submitted && <Submitted title='已成功提交报名表单' description='请等待我们的短信通知，如果你需要修改信息，可以再次提交' className='fullHeight' />}
                {this.state.snackBarOn && <SnackBar content={this.state.content} onClose={this.handleClose}/>}
            </div>
        );
    }
}

export default Form;
