import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import styles from '../../style/TextArea';
// import Button from '../Button';

interface Props extends WithStyles<typeof styles> {
    onChange: (e: React.ChangeEvent) => void;
}

class TextArea extends PureComponent<Props> {
    render() {
        const { classes, onChange } = this.props;
        return (
            <div className={classNames(classes.container, classes.border, classes.font)}>
                {/* <Button name='自我介绍' bgColor='primary' textColor='white' className='textAreaLabel disabled' /> */}
                <div className={classes.textLabel}>
                    <div>自我介绍</div>
                </div>
                <textarea className={classes.textarea} onChange={onChange} />
            </div>
        );
    }
}

export default withStyles(styles)(TextArea);
