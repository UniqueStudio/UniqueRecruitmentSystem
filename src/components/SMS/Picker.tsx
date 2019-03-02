import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GRADES } from '../../config/consts';
import { Candidate } from '../../config/types';
import styles from '../../styles/template';

interface Props extends WithStyles<typeof styles> {
    selected: Candidate[];
    onDelete: (name: string) => () => void;
}

class Picker extends PureComponent<Props> {

    render() {
        const { classes, onDelete, selected } = this.props;
        return (
            <div className={classNames(classes.templateContent, classes.templateItem, classes.picker)}>
                {selected.length === 0
                    ? <Typography variant='h6' className={classes.templateItem}>你未选中任何人!</Typography>
                    : selected.map(
                        ({ _id, name, grade, institute }) => <Chip
                            key={_id}
                            label={`${name} ${GRADES[grade]} ${institute}`}
                            onDelete={onDelete(_id)}
                            className={classes.templateItem}
                            color='primary'
                        />)
                }
            </div>
        );
    }
}

export default withStyles(styles)(Picker);
