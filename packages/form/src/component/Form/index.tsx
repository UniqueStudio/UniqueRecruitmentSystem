import * as React from 'react';
import Button from '../Button';
import Input from '../Input';
import Choose from '../Choose';
import Select from '../Select';
import { GRADES, GROUPS, SCORES } from '../../const';
import TextArea from '../TextArea';


class Form extends React.Component {
    public render() {
        return (
            <div className='formContainer'>
                <div className='form'>
                    <div className='formRow'>
                        <Input for='name' size='md' name='姓名' />
                        <Input for='mail' size='lg' name='邮箱' />
                        <Input for='institute' size='md' name='学院' />
                        <Input for='major' size='md' name='专业' />
                    </div>
                    <div className='formRow'>
                        <div className='formRow choose'>
                            <Choose/>
                        </div>
                        <div className='formRow selects'>
                            <Select selections={GRADES} name='所属年级'/>
                            <Select selections={GROUPS} name='组别选择'/>
                            <Select selections={SCORES} name='加权选择'/>
                        </div>
                    </div>
                    <div className='formRow'>
                        <div className='formColumn'>
                            <div className='formRow rowItem'>
                                <Input for='phone' size='ml' name='手机号' />
                                <Button name='接受验证码' bgColor='primaryLighter' textColor='primary' />
                            </div>
                            <div className='formRow rowItem'>
                                <Input for='code' size='sm' name='验证码' />
                                <Button name='上传简历/作品集' bgColor='primaryLighter' textColor='primary' />
                            </div>
                        </div>
                        <div className='formColumn'>
                            <TextArea/>
                        </div>
                    </div>
                </div>
                <div className='submit'>
                    <Button name='提交' bgColor='secondary' textColor='white' />
                </div>
            </div>
        );
    }
}

export default Form;
