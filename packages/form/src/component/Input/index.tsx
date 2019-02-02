import React, { PureComponent } from 'react';

import classNames from 'classnames';

interface Props {
    name: string;
    for: string;
    placeholder?: string;
    className?: string;
    onChange: (e: React.ChangeEvent) => void;
}

class Input extends PureComponent<Props> {

    render() {
        const { className, for: htmlFor, name, onChange, placeholder } = this.props;

        return (
            <div className={classNames('input', className)}>
                <label htmlFor={htmlFor} className='label'>
                    <div className='labelName'>{name}</div>
                </label>
                <input placeholder={placeholder} id={htmlFor} name={htmlFor} className='inputContent' onChange={onChange} />
            </div>
        );
    }
}

export default Input;
