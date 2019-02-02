import React, { PureComponent } from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { InjectedNotistackProps } from 'notistack';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GENDERS } from '../../config/consts';
import { /*Candidate, User as GroupType, Recruitment, Time, */User } from '../../config/types';
import styles from '../../styles/group';
import { titleConverter } from '../../utils/titleConverter';

// import GroupCandidates from './GroupCandidates';
// import GroupDialog from './GroupDialog';
// import GroupModal from './GroupModal';

interface Props extends WithStyles {
    // candidate: Map<string, Candidate>[];
    groupInfo: User[];
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];

    // currentRecruitment: Recruitment;
    // pendingRecruitment: string;
    // requestCandidate: (group: string, recruitmentName: string) => void;
    // requestGroup: (group: string) => void;
    // requestRecruitments: () => void;
    // sendInterview: (content: object) => void;
    // toggleSnackbar: (message: string, color: string) => void;
    // setAllSlots: (title: string, slots: number[], group: string) => void;
    // setOneSlot: (id: string, time: object) => void;
}

const heads = ['成员姓名', '性别', '电话号码', '邮箱', '加入时间', '组长？', '管理员？'];
const memberDataConverter = ({ username, gender, phone, mail, joinTime, isCaptain, isAdmin }: User) => [
    username,
    GENDERS[gender],
    phone || '未知',
    mail || '未知',
    titleConverter(joinTime),
    isCaptain ? '是' : '否',
    isAdmin ? '是' : '否'
];

class Group extends PureComponent<Props> {

    render() {
        const { classes, /*candidate, group, currentRecruitment,*/ groupInfo } = this.props;
        // const { interviewStage, counts, modalOpen, code, dialogOpen, place } = this.state;

        if (!groupInfo) {
            return null;
        }
        // const disabled = interviewStage === 1
        //     ? !(candidate[2] && candidate[2].size && currentRecruitment && currentRecruitment.time1[userGroup] && counts.length)
        //     : !(candidate[4] && candidate[4].size && currentRecruitment && currentRecruitment.time2 && counts.length);
        // const currentCandidates = candidate.length
        //     ? candidate.map((candidate) => [...candidate.values()])[interviewStage * 2]
        //     : [];
        // const filter = (candidate: Candidate) =>
        //     (!candidate.abandon && !candidate.rejected && candidate[`time${interviewStage}`] && candidate[`slot${interviewStage}`]);
        // const filteredCandidates = currentCandidates.filter(filter);
        return (
            <>
                <div className={classes.infoContainer}>
                    {/*<GroupCandidates*/}
                    {/*candidate={currentCandidates}*/}
                    {/*interviewStage={interviewStage}*/}
                    {/*disabled={disabled}*/}
                    {/*toggleModal={this.toggleModal}*/}
                    {/*toggleDialog={this.toggleDialog}*/}
                    {/*handleChange={this.handleChange}*/}
                    {/*setTime={this.setOneSlot}*/}
                    {/*/>*/}
                    <Paper className={classes.paper}>
                        <div className={classes.title}>
                            <Typography variant='h6'>
                                本组成员信息
                            </Typography>
                        </div>
                        <div className={classes.tableContainer}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        {heads.map((head, index) =>
                                            <TableCell key={index} classes={{ root: classes.tableCell }}>{head}</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupInfo.map(memberDataConverter).map((member, index) =>
                                        <TableRow key={index}>
                                            {member.map((item, idx) =>
                                                <TableCell classes={{ root: classes.tableCell }} key={idx}>{item}</TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Paper>
                    {/*<GroupDialog*/}
                    {/*dialogOpen={dialogOpen}*/}
                    {/*toggleDialog={this.toggleDialog}*/}
                    {/*handleInput={this.handleInput}*/}
                    {/*code={code}*/}
                    {/*place={place}*/}
                    {/*sendInterview={this.sendInterview}*/}
                    {/*candidate={filteredCandidates}*/}
                    {/*/>*/}
                    {/*{!disabled && <GroupModal*/}
                    {/*modalOpen={modalOpen}*/}
                    {/*submitAllocation={this.submitAllocation}*/}
                    {/*toggleModal={this.toggleModal}*/}
                    {/*/>}*/}
                </div>
            </>
        );
    }
}

export default withStyles(styles)(Group);
