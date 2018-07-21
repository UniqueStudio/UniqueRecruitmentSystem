import * as React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Add as AddIcon } from '@material-ui/icons'

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import Modal from '../Modal';

class ChartNew extends React.PureComponent<WithStyles> {
    state = {
        modalOpen: false
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.chart}>
                <Tooltip title="发起招新" classes={{tooltip: classes.tooltip}}>
                    <IconButton
                        className={classes.newButton}
                        classes={{ root: classes.newButtonRoot }}
                        onClick={this.toggleModalOpen}
                    >
                        <AddIcon color='primary' className={classes.newIcon} />
                    </IconButton>
                </Tooltip>
                <Modal title="发起招新"
                       open={this.state.modalOpen}
                       onClose={this.toggleModalOpen}
                >
                    <div className={classes.newContainer}>
                        <TextField
                            label="招新名称"
                            defaultValue=""
                            margin="normal"
                        />
                        <TextField
                            label="开始时间"
                            defaultValue=""
                            margin="normal"
                        />
                        <TextField
                            label="结束时间"
                            defaultValue=""
                            margin="normal"
                        />
                        <Button color='primary' variant='contained'>确定</Button>
                    </div>
                </Modal>
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(ChartNew));
