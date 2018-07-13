import * as React from 'react';
import * as classNames from 'classnames';
import {
    Chip,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/template'
import withRoot from '../../style/withRoot';

interface CandidateInfo {
    uid: string
    name: string;
    grade: string;
    institute: string;
}

interface Props extends WithStyles {
    selected: CandidateInfo[];
    onDelete: (name: string) => void;
}

class Step extends React.Component<Props> {

    render() {
        const { classes, onDelete, selected } = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                {selected.length === 0 ?
                    <Typography variant='title' className={classes.templateItem}>你未选中任何人!</Typography>
                    : selected.map(i =>
                        <Chip
                            key={i.name}
                            label={`${i.name} ${i.grade} ${i.institute}`}
                            onDelete={() => onDelete(i.uid)}
                            className={classes.templateItem}
                        />
                    )
                }
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


