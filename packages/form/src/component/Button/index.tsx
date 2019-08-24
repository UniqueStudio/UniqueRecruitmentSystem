import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import styles from '../../style/Button';
import '../../style/Button.scss';

interface Props extends WithStyles<typeof styles> {
    name: string;
    bgColor: string;
    textColor: string;
    id?: string;
    className?: string;
    onClick?: () => void;
}

class Button extends PureComponent<Props> {
    render() {
        const { name, textColor, bgColor, id, className, onClick, classes } = this.props;
        return (
            <button
                id={id}
                className={classNames(
                    classes.border,
                    classes.height,
                    'button',
                    `text_${textColor}`,
                    `background_${bgColor}`,
                    className
                )}
                onClick={onClick}
            >
                <div className={classNames('buttonName', classes.font)}>{name}</div>
            </button>
        );
    }
}

export default withStyles(styles)(Button);
