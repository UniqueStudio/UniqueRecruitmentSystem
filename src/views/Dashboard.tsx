import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { InjectedNotistackProps } from 'notistack';

import AddOne from '../components/AddOne';
import Chart from '../components/Chart';
import { Recruitment } from '../config/types';
import styles from '../styles/dashboard';

interface Props extends WithStyles {
    data: Recruitment[];
    canLaunch: boolean;
    viewing: string;
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];
    launchRecruitment: (info: Partial<Recruitment>) => void;
    setViewing: (title: string) => void;
}

class Dashboard extends PureComponent<Props> {

    state = {
        shouldClear: false,
        shouldRedirect: false,
    };

    componentDidUpdate({ viewing, data: { length } }: Props) {
        this.setState((prevState, props) => ({
            shouldClear: length !== props.data.length,
            shouldRedirect: viewing !== props.viewing && viewing
        }));
    }

    setViewing = (title: string) => () => {
        this.props.setViewing(title);
    };

    render() {
        const { data, classes, canLaunch, enqueueSnackbar, launchRecruitment } = this.props;
        const { shouldClear, shouldRedirect } = this.state;
        return shouldRedirect ? <Redirect to='/data' /> : (
            <div className={classes.root}>
                <div className={classes.left}>
                    <Typography variant='h4' className={classes.title}>Recruitments</Typography>
                    <Divider variant='middle' />
                    <div className={classes.blocksContainer}>
                        <div className={classes.block}>
                            <AddOne
                                enqueueSnackbar={enqueueSnackbar}
                                launchRecruitment={launchRecruitment}
                                disabled={!canLaunch}
                                shouldClear={shouldClear}
                            />
                        </div>
                        {!data.length ? null : data.map((recruitment) => <Chart
                            key={recruitment._id}
                            data={recruitment}
                            onClick={this.setViewing(recruitment.title)}
                        />)}
                    </div>
                </div>
                <div className={classes.right}>
                    <Typography variant='h4' className={classes.title}>Notifications</Typography>
                    <Divider variant='middle' />
                    <Paper className={classes.paper}>
                        123
                    </Paper>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);
