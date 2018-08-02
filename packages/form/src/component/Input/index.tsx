import * as React from 'react';
import classNames from 'classnames';

interface Props {
    name: string;
    size: string;
    for: string;
    className?: string;
    onChange: (name: string) => (e: React.ChangeEvent) => void;
}

class Input extends React.Component<Props> {

    public render() {
        const { className, for: htmlFor, size, name, onChange } = this.props;

        return (
            <div className={classNames('input', className)}>
                <label htmlFor={htmlFor} className='label'>
                    <div className='labelName'>{name}</div>
                </label>
                <input id={htmlFor} name={htmlFor} className={classNames('inputContent', size)} onChange={onChange(htmlFor)} />
            </div>
        );
    }
}

export default Input;
