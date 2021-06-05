import React, { PureComponent } from 'react';

import classNames from 'classnames';
import Button from '../Button';

interface Props {
    type: string;
    onConfirm: () => void;
    onDeny: () => void;
}

class Modal extends PureComponent<Props> {

    public render() {
        const { type, onConfirm, onDeny } = this.props;
        return (
            <div className={classNames('modal', type === 'abandon' ? 'background_primary' : 'background_secondary', `modal_${type}`)}>
                <p className='prompt'>{
                    type === 'submit'
                        ? '请务必保证面试可以到场，你的选择将无法更改'
                        : '如果你以上时间都无法到场，可以尝试联系我们调整时间，或选择放弃面试同时错过本次招新'
                }</p>
                <div className='modalButtons'>
                    <Button name='我确认' bgColor='pureWhite' textColor='primary' onClick={onConfirm} />
                    <Button name='再想想' bgColor='pureWhite' textColor='secondary' onClick={onDeny} />
                </div>
            </div>
        );
    }
}

export default Modal;
