import * as React from 'react';
import Button from '../Button';
import Input from '../Input';
import Choose from '../Choose';
import Select from '../Select';
import { GRADES, GROUPS, SCORES } from '../../const';
import TextArea from '../TextArea';

class Form extends React.Component {
    state = {
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
        const info = { ...this.state };
        if (Object.values(info).includes('')) {
            console.log('empty');
            return;
        }
        if (!this.checkMail(info.mail)) {
            console.log('mail');
            return;
        }
        if (!this.checkPhone(info.phone)) {
            console.log('phone');
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
                    console.log('success');
                } else throw res;
            })
            .catch(err => {
                console.log('error');
            })
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({ [name]: e.target['value'] });
    };

    public render() {
        return (
            <div className='formContainer'>
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
            </div>
        );
    }
}

export default Form;
