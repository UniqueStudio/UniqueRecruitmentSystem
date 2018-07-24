import * as React from 'react';
import Button from '../Button';

class Time extends React.Component {

    public render() {
        return (
            <div className='timeContainer'>
                <div className='timeHeader'>
                    <h2 className='subtitle'>面试时间选择</h2>
                    <h3 className='description'>请选择以下你有空的全部时间段，一旦确定无法更改。</h3>
                </div>
                {['9月13日', '9月14日', '9月15日'].map((i, j) =>
                    <div key={j} className='timeContent'>
                        <Button name={i}
                                bgColor='primary'
                                textColor='white' />
                        <Button name='上午'
                                bgColor='white'
                                textColor='primary' />
                        <Button name='下午'
                                bgColor='white'
                                textColor='primary' />
                        <Button name='晚上'
                                bgColor='white'
                                textColor='primary' />
                    </div>
                )}
                <div className='submit timeSubmit'>
                    <Button name='无法到场' bgColor='primaryLightLittleMore' textColor='white' />
                    <Button name='提交' bgColor='secondary' textColor='white' />
                </div>
            </div>
        );
    }
}

export default Time;
