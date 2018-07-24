import * as React from 'react';
import Button from '../Button';

class TextArea extends React.Component {
    public render() {
        return (
            <div className='textAreaContainer'>
                <Button name='自我介绍'
                        bgColor='primary'
                        textColor='white'
                        className='textAreaLabel disabled'
                />
                <textarea className='textArea' />
            </div>
        );
    }
}

export default TextArea;
