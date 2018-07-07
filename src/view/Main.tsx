import * as React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Button, IconButton, Toolbar, Typography, withStyles, WithStyles } from '@material-ui/core';
import withRoot from '../style/withRoot';
import styles from '../style/style';

// import logo from './image/logo.png';

class Main extends React.Component<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Unique Recruitment Dashboard
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(Main));
