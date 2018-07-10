import * as React from "react";
import {
    Divider,
    Paper,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import { Portrait as PortraitIcon } from "@material-ui/icons";
// import { grey } from "@material-ui/core/colors";

import styles from "../style/style";
import Candidate from "../container/Candidate";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    title: string;
    candidates: object;
}

const titleToStep = {
    '报名流程': '0',
    '笔试流程': '1',
    '面试流程': '2',
    '熬测流程': '3',
    '群面流程': '4',
};

class Column extends React.Component<Props> {
    render() {
        const { classes, title, candidates } = this.props;
        return (
            <Paper elevation={0} className={classes.column + ' ' + classes.halfEvelationCard}>

                <div style={{ top: '-30px', position: 'relative', borderRadius: '3px', width: '80px', height: '80px', background: 'linear-gradient(60deg, #ffa726, #fb8c00)', boxShadow: '0 12px 20px -10px rgba(255, 152, 0, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(255, 152, 0, 0.2)' }}>
                    <span style={{ color: 'white', fontSize: '60px' }}>
                        <PortraitIcon color="inherit" fontSize="inherit"/>
                    </span>
                </div>
                <Typography variant="headline" className={classes.columnTitle}>
                    {title}
                </Typography>
                <Divider />
                {Object.entries(candidates[titleToStep[title]]).map(i => (
                    <Candidate step={titleToStep[title]}
                               name={i[0]}
                               grade={i[1]['grade']}
                               institute={i[1]['institute']}
                               comments={i[1]['comments']}
                               key={i[0]}
                    />
                ))}
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
