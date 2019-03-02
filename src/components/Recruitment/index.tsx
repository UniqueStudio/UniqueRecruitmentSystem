import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { SetRecruitment } from '../../actions';
import { GROUPS, GROUPS_ } from '../../config/consts';
import { Group, Recruitment as RecruitmentType, Time } from '../../config/types';
import styles from '../../styles/data';
import { getMidnight } from '../../utils/getMidnight';
import Accordion from '../Accordion';
import Dates from '../Dates';
import Schedule from '../Schedule';

interface Props extends WithStyles<typeof styles> {
    data: RecruitmentType;
    canLaunch: boolean;
    userGroup: Group;
    setRecruitment: (data: SetRecruitment['data']) => void;
    enqueueSnackbar: (info: string) => void;
}

class Recruitment extends PureComponent<Props> {

    state = {
        begin: new Date(this.props.data.begin),
        end: new Date(this.props.data.end),
        stop: new Date(this.props.data.stop)
    };

    handleChange = (name: string) => (date: Date) => {
        this.setState({
            [name]: date,
        });
    };

    setInterview = (type: 'team' | 'group', groupName?: Group) => (interview: Time[]) => {
        const { begin, end, stop } = this.state;
        const { data: { title }, setRecruitment, enqueueSnackbar } = this.props;
        if (begin >= end) {
            enqueueSnackbar('结束时间必须大于开始时间！');
            return;
        }
        if (stop >= end) {
            enqueueSnackbar('截止时间必须大于开始时间！');
            return;
        }
        setRecruitment({
            title,
            group: groupName,
            begin: getMidnight(begin),
            end: getMidnight(end),
            stop: getMidnight(stop),
            [`${type}Interview`]: interview
        });
    };

    setTime = () => {
        const { begin, end, stop } = this.state;
        const { data: { title }, setRecruitment, enqueueSnackbar } = this.props;
        if (begin >= end) {
            enqueueSnackbar('结束时间必须大于开始时间！');
            return;
        }
        if (stop >= end) {
            enqueueSnackbar('截止时间必须大于开始时间！');
            return;
        }
        setRecruitment({
            title,
            begin: getMidnight(begin),
            stop: getMidnight(stop),
            end: getMidnight(end)
        });
    };

    render() {
        const { data, classes, userGroup, canLaunch } = this.props;
        const { interview: teamInterview, groups } = data;

        const { begin, end, stop } = this.state;
        return (
            <div className={classes.paper}>
                <div className={classes.textFieldContainer}>
                    <Schedule
                        begin={begin}
                        end={end}
                        stop={stop}
                        onChange={this.handleChange}
                        disabled={!canLaunch}
                        disablePast={false}
                        classes={classes}
                    />
                    <Button onClick={this.setTime} variant='contained' color='primary' disabled={!canLaunch}>修改时间</Button>
                </div>
                {groups.map(({ name, interview }, index) =>
                    <Accordion title={`${GROUPS[GROUPS_.indexOf(name)]}组组面时间/人数`} key={index}>
                        <Dates dates={interview} disabled={!canLaunch && userGroup !== name} setRecruitment={this.setInterview('group', name)} />
                    </Accordion>
                )}
                <Accordion title='群面时间/人数'>
                    <Dates dates={teamInterview} disabled={!canLaunch} setRecruitment={this.setInterview('team')} />
                </Accordion>
            </div>
        );
    }
}

export default withStyles(styles)(Recruitment);
