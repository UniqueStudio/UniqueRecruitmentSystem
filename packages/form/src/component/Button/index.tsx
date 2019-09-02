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
            <div
                id={id}
                className={classNames(classes.border, classes.height, 'button', className)}
            >
                <button
                    className={classNames('buttonName', `text_${textColor}`, `background_${bgColor}`, classes.font)}
                    onClick={onClick}
                >
                    {name}
                </button>
            </div>
        );
    }
}

export default withStyles(styles)(Button);
