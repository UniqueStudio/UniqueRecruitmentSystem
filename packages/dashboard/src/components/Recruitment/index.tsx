import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { SetRecruitment } from '../../actions';
import { GROUPS, GROUPS_ } from '../../config/consts';
import { Group, Recruitment as RecruitmentType, Time } from '../../config/types';
import styles from '../../styles/data';
import Accordion from '../Accordion';
import BeginEnd from '../BeginEnd';
import Dates from '../Dates';

interface Props extends WithStyles {
    data: RecruitmentType;
    canLaunch: boolean;
    userGroup: Group;
    setRecruitment: (data: SetRecruitment['data']) => void;
}

class Recruitment extends PureComponent<Props> {

    state = {
        begin: new Date(this.props.data.begin),
        end: new Date(this.props.data.end),
    };

    handleChange = (name: string) => (date: Date) => {
        this.setState({
            [name]: date,
        });
    };

    setInterview = (type: 'team' | 'group', groupName?: Group) => (interview: Time[]) => {
        const { begin, end } = this.state;
        const { data: { title }, setRecruitment } = this.props;
        setRecruitment({ title, group: groupName, begin: +begin, end: +end, [`${type}Interview`]: interview });
    };

    setTime = () => {
        const { begin, end } = this.state;
        const { data: { title }, setRecruitment } = this.props;
        setRecruitment({ title, begin: +begin, end: +end });
    };

    render() {
        const { data, classes, userGroup, canLaunch } = this.props;
        const { interview: teamInterview, groups } = data;

        const { begin, end } = this.state;
        return (
            <div className={classes.paper}>
                <div className={classes.textFieldContainer}>
                    <BeginEnd
                        begin={begin}
                        end={end}
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
