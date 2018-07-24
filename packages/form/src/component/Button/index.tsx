import * as React from 'react';
import classNames from 'classnames';

interface Props {
    name: string;
    bgColor: string;
    textColor: string;
    id?: string;
    className?: string;
    onClick?: () => void;
}

class Button extends React.Component<Props> {

    public render() {
        const { name, textColor, bgColor, id, className, onClick } = this.props;
        return (
            <button id={id}
                    className={classNames('button', `text_${textColor}`, `background_${bgColor}`, className)}
                    onClick={onClick}
            >
                <div className='buttonName'>{name}</div>
            </button>
        );
    }
}

export default Button;
