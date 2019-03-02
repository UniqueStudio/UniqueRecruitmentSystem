import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { SetRecruitment } from '../actions';
import Recruitment from '../components/Recruitment';
import Table from '../components/Table';
import { Candidate, Group, Recruitment as RecruitmentType } from '../config/types';

import styles from '../styles/data';
import { sortBySlot } from '../utils/sortBySlot';

interface Props extends WithStyles<typeof styles> {
    candidates: Candidate[];
    recruitment?: RecruitmentType;
    canLaunch: boolean;
    userGroup: Group;
    setRecruitment: (data: SetRecruitment['data']) => void;
    allocateOne: (cid: string, time: number, type: 'group' | 'team') => void;
    allocateAll: (type: 'group' | 'team') => void;
    enqueueSnackbar: (info: string) => void;
}

class Data extends PureComponent<Props> {

    state = {
        interviewType: 'group' as 'group',
    };

    changeType = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            interviewType: value
        });
    };

    render() {
        const { classes, recruitment, userGroup, canLaunch, setRecruitment, candidates, allocateOne, allocateAll, enqueueSnackbar } = this.props;
        const { interviewType } = this.state;
        const sorted = (interviewType === 'group'
                ? candidates.filter(({ group, step }) => group === userGroup && step === 2)
                : candidates.filter(({ step }) => step === 4)
        ).sort(sortBySlot);
        return !userGroup || !recruitment ? null : (
            <div className={classes.container}>
                <Recruitment
                    canLaunch={canLaunch}
                    data={recruitment}
                    setRecruitment={setRecruitment}
                    userGroup={userGroup}
                    enqueueSnackbar={enqueueSnackbar}
                />
                <Table
                    candidates={sorted}
                    changeType={this.changeType}
                    interviewType={interviewType}
                    allocateOne={allocateOne}
                    allocateAll={allocateAll}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Data);
