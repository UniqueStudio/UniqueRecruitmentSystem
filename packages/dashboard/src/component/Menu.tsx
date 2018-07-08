import * as React from 'react';
import * as classnames from 'classnames';
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    WithStyles,
    withStyles
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Dashboard from '@material-ui/icons/Dashboard';
import DateRange from '@material-ui/icons/DateRange';

import withRoot from '../style/withRoot';
import styles from '../style/style';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
}

class Menu extends React.Component<Props> {
    render() {
        const { classes, open, toggleOpen } = this.props;
        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classnames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={toggleOpen}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <DateRange />
                        </ListItemIcon>
                        <ListItemText primary="历年数据" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="报名审核" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DateRange />
                        </ListItemIcon>
                        <ListItemText primary="测试测试" />
                    </ListItem>
                </List>
            </Drawer>
        )
    }
}

export default withRoot(withStyles(styles)(Menu));
