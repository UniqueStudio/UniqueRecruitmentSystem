import classNames from 'classnames';
import React, { memo } from 'react';

import useStyles from '../../style/Button';
import '../../style/Button.scss';

interface ButtonProps {
    name: string;
    bgColor: string;
    textColor: string;
    id?: string;
    className?: string;
    onClick?: () => void;
}

const Button = memo((props: ButtonProps) => {
    const classes = useStyles() as any;
    const { name, textColor, bgColor, id, className, onClick } = props;
    return (
        <div id={id} className={classNames(classes.border, classes.height, 'button', className)}>
            <button
                className={classNames('buttonName', `text_${textColor}`, `background_${bgColor}`, classes.font)}
                onClick={onClick}
            >
                {name}
            </button>
        </div>
    );
});

export default Button;
