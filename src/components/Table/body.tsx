import { Button, Checkbox, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { Modal } from '@components/Modal';
import { OrderBy } from '@components/Table/header';
import { compareCandidate } from '@components/Table/order';
import { GROUP_MAP, PERIOD_MAP } from '@config/consts';
import { GroupOrTeam, InterviewType } from '@config/enums';
import { Candidate, Interview } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/data';
import { Order } from '@utils/order';
import { stableSort } from '@utils/reducerHelper';

interface Props {
    candidates: Candidate[];
    type: InterviewType;
    order: Order;
    orderBy: OrderBy;
    toggleDialog: (id?: string) => () => void;
}

export const Body: FC<Props> = observer(({ order, orderBy, toggleDialog, candidates, type }) => {
    const classes = useStyles();
    const { $candidate } = useStores();
    const [viewing, setViewing] = useState<Interview[]>([]);

    const handleCheck = (id = '') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            $candidate.selectOne(id);
        } else {
            $candidate.deselectOne(id);
        }
    };
    const toggleViewing = (nextViewing: Interview[]) => () => {
        setViewing(nextViewing);
    };

    return (
        <TableBody>
            {stableSort<Candidate>(candidates, compareCandidate(order, orderBy)).map(
                ({ rejected, abandoned, name, group, id, interviewAllocations, interviewSelections }) => {
                    const allocation = interviewAllocations[type];
                    const selections = interviewSelections.filter(
                        ({ name }) => name === (type === InterviewType.group ? GroupOrTeam[group] : GroupOrTeam.unique),
                    );
                    const slotInfo = allocation ? new Date(allocation).toLocaleString('zh-CN') : '未分配';
                    const state = (
                        <div>
                            {rejected ? (
                                '已淘汰'
                            ) : abandoned ? (
                                '已放弃'
                            ) : selections.length ? (
                                <Button color='primary' onClick={toggleViewing(selections)}>
                                    查看
                                </Button>
                            ) : (
                                '未选择'
                            )}
                        </div>
                    );
                    const button = (
                        <Button variant='contained' color='primary' onClick={toggleDialog(id)}>
                            设置
                        </Button>
                    );
                    const items = [name, GROUP_MAP.get(group), slotInfo, state, button];
                    return (
                        <TableRow key={id}>
                            <TableCell classes={{ root: classes.tableCell }} padding='checkbox'>
                                <Checkbox checked={$candidate.selected.has(id)} onChange={handleCheck(id)} />
                            </TableCell>
                            {items.map((item, index) => (
                                <TableCell classes={{ root: classes.tableCell }} key={index}>
                                    {item}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                },
            )}
            <Modal open={!!viewing.length} onClose={toggleViewing([])} title='选择情况'>
                {viewing.map(({ date, period }, index) => (
                    <div className={classes.textFieldContainer} key={index}>
                        <TextField
                            label='日期'
                            value={new Date(date).toLocaleDateString('zh-CN')}
                            className={classes.datePicker}
                        />
                        <TextField label='时间段' value={PERIOD_MAP.get(period)} className={classes.textField} />
                    </div>
                ))}
            </Modal>
        </TableBody>
    );
});
