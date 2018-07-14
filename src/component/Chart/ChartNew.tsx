import * as React from 'react';
import {
    Button,
    IconButton, TextField, Tooltip,
    WithStyles,
    withStyles
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons'

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import ChartContainer from './ChartContainer';
import Modal from '../Modal';

class ChartNew extends React.Component<WithStyles> {
    state = {
        modalOpen: false
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        const { classes } = this.props;
        return (
            <ChartContainer>
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
            </ChartContainer>
        )
    }
}

export default withRoot(withStyles(styles)(ChartNew));
