import * as React from 'react';
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';

interface CandidateInfo {
    cid: string
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
                            key={i.cid}
                            label={`${i.name} ${i.grade} ${i.institute}`}
                            onDelete={() => onDelete(i.cid)}
                            className={classes.templateItem}
                        />
                    )
                }
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


