// import { Button } from '@material-ui/core';
// import { observer } from 'mobx-react-lite';
// import React, { FC, useState } from 'react';
//
// import { createRecruitmentInterviews, setRecruitmentSchedule } from '@apis/rest';
// import { Allocation } from '@components/Allocation';
// import { Schedule } from '@components/Schedule';
// import { GROUP_MAP } from '@config/consts';
// import { useStores } from '@hooks/useStores';
// import useStyles from '@styles/data';
// import { getMidnight } from '@utils/getMidnight';
// import { Group } from '@config/enums';
//
// export const Recruitment: FC = observer(() => {
//     const { $recruitment, $component, $user } = useStores();
//     const { beginning, end, deadline, id, name, interviews } = $recruitment.recruitments.find(
//         ({ id }) => id === $recruitment.viewing,
//     )!;
//     const classes = useStyles();
//     const [beginningState, setBeginning] = useState(new Date(beginning));
//     const [endState, setEnd] = useState(new Date(end));
//     const [deadlineState, setDeadline] = useState(new Date(deadline));
//     const handleChange = (name: string) => (date: Date | null) => {
//         if (!date) {
//             return;
//         }
//         if (name === 'begin') setBeginning(date);
//         if (name === 'end') setEnd(date);
//         if (name === 'stop') setDeadline(date);
//     };
//
//     const setInterview = (type: 'team' | 'group', groupName?: Group) => (interviewTime: Time[]) => {
//         if (beginningState >= endState) {
//             $component.enqueueSnackbar('结束时间必须大于开始时间', 'warning');
//             return;
//         }
//         if (deadlineState >= endState) {
//             $component.enqueueSnackbar('截止时间必须大于开始时间', 'warning');
//             return;
//         }
//         return createRecruitmentInterviews();
//     };
//
//     const setTime = () => {
//         if (beginningState >= endState) {
//             $component.enqueueSnackbar('结束时间必须大于开始时间', 'warning');
//             return;
//         }
//         if (deadlineState >= endState) {
//             $component.enqueueSnackbar('截止时间必须大于开始时间', 'warning');
//             return;
//         }
//         return setRecruitmentSchedule(id, {
//             beginning: getMidnight(beginningState),
//             deadline: getMidnight(deadlineState),
//             end: getMidnight(endState),
//         });
//     };
//
//     return (
//         <div className={classes.recruitmentContainer}>
//             <div className={classes.textFieldContainer}>
//                 <Schedule
//                     beginning={beginningState}
//                     end={endState}
//                     deadline={deadlineState}
//                     onChange={handleChange}
//                     disabled={!$user.isAdminOrCaptain}
//                     disablePast={false}
//                     className={classes.datePicker}
//                 />
//                 <div className={classes.buttonContainer}>
//                     <Button onClick={setTime} variant='contained' color='primary' disabled={!$user.isAdminOrCaptain}>
//                         修改时间
//                     </Button>
//                 </div>
//             </div>
//             {interviews.map(({ name, date, period, slotNumber, id }) => (
//                 <Allocation
//                     title={`${GROUP_MAP.get(name)!}组组面时间/人数`}
//                     key={id}
//                     dates={groupInterview}
//                     disabled={!$user.isAdminOrCaptain && $user.info.group !== name}
//                     setRecruitment={setInterview('group', name)}
//                 />
//             ))}
//             <Allocation
//                 title='群面时间/人数'
//                 dates={interview}
//                 disabled={!$user.isAdminOrCaptain}
//                 setRecruitment={setInterview('team')}
//             />
//         </div>
//     );
// });
export {};
