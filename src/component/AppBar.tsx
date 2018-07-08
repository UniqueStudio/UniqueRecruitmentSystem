import * as React from 'react';
import * as classnames from 'classnames';
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import styles from '../style/style'
import withRoot from '../style/withRoot';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
}

class Bar extends React.Component<Props> {
    render() {
        const { classes, open, toggleOpen } = this.props;
        return (
            <AppBar
                position="absolute"
                className={classnames(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!open}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleOpen}
                        className={classnames(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap>
                        联创团队招新管理系统
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
