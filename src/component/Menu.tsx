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
import {
    Dashboard as DashboardIcon,
    DateRange as DateRangeIcon,
    Home as HomeIcon,
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';

import withRoot from '../style/withRoot';
import styles from '../style/style';
import { Link } from 'react-router-dom';

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
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link to={`/`} style={{ textDecoration: 'none' }}>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="首页" />
                        </ListItem>
                    </Link>
                    <Link to={`/data`} style={{ textDecoration: 'none' }}>
                        <ListItem button>
                            <ListItemIcon>
                                <DateRangeIcon />
                            </ListItemIcon>
                            <ListItemText primary="历年数据" />
                        </ListItem>
                    </Link>
                    <Link to={`/view`} style={{ textDecoration: 'none' }}>
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="报名审核" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        )
    }
}

export default withRoot(withStyles(styles)(Menu));
