import * as React from 'react';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import HomeIcon from '@material-ui/icons/Home';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import withRoot from '../../style/withRoot';
import styles from '../../style/index';
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
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
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
                                <InsertChartIcon />
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
