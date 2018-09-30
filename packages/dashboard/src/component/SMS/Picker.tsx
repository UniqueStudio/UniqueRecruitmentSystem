import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Candidate } from '../../lib/const';

import styles from '../../style/template';
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    selected: Candidate[];
    onDelete: (name: string) => void;
}

class Picker extends PureComponent<Props> {

    render() {
        const { classes, onDelete, selected } = this.props;
        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                {selected.length === 0
                    ? <Typography variant='title' className={classes.templateItem}>你未选中任何人!</Typography>
                    : selected.map(
                        (i, j) => <Chip
                            key={j}
                            label={`${i.name} ${i.grade} ${i.institute}`}
                            onDelete={() => onDelete(i._id)}
                            className={classes.templateItem}
                            color='primary'
                        />)
                }
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Picker));
