import * as React from "react";
import {
    Modal, TextField,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";

import styles from "../style/style";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    open: boolean;
    onClose: () => void;
}

class InfoModal extends React.Component<Props> {

    render() {
        const { classes, open, onClose } = this.props;
        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <div className={classes.modal}>
                    <div className={classes.columnHeader}>
                        <Typography variant="headline" className={classes.columnTitle}>
                            详细信息
                        </Typography>
                    </div>
                    <TextField
                        label="姓名"
                        defaultValue="xxxxx"
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        } as any /* see https://github.com/mui-org/material-ui/issues/8047 */}
                    />
                    <TextField
                        label="年级"
                        defaultValue="xxx"
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        } as any}
                    />
                    <TextField
                        label="年级"
                        defaultValue="xxx"
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        } as any}
                    />
                    <TextField
                        label="年级"
                        defaultValue="xxx"
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        } as any}
                    />
                </div>
            </Modal>
        )
    }
}

export default withRoot(withStyles(styles)(InfoModal));

