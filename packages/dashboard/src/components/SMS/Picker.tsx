import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GRADES } from 'Config/consts';
import { Candidate } from 'Config/types';
import styles from 'Styles/template';

interface Props extends WithStyles {
    selected: Candidate[];
    onDelete: (name: string) => () => void;
}

class Picker extends PureComponent<Props> {

    render() {
        const { classes, onDelete, selected } = this.props;
        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
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
