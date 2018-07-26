import * as React from 'react';
import classNames from 'classnames';

interface Props {
    name: string;
    size: string;
    for: string;
    onChange: (name: string) => (e: React.ChangeEvent) => void;
}

class Input extends React.Component<Props> {

    public render() {
        return (
            <div className='input'>
                <label htmlFor={this.props.for} className='label'>
                    <div className='labelName'>{this.props.name}</div>
                </label>
                <input id={this.props.for} name={this.props.for} className={classNames('inputContent', this.props.size)} onChange={this.props.onChange(this.props.for)} />
            </div>
        );
    }
}

export default Input;
