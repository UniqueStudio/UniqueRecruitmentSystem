import { Button, Checkbox, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import Modal from '@components/Modal';
import { OrderBy } from '@components/Table/header';
import { compareCandidate } from '@components/Table/order';
import { GROUPS, GROUPS_ } from '@config/consts';
import { Candidate, Time } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/data';
import { Order } from '@utils/order';
import { stableSort } from '@utils/reducerHelper';

interface Props {
    candidates: Candidate[];
    interviewType: 'group' | 'team';
    order: Order;
    orderBy: OrderBy;
    toggleDialog: (id?: string) => () => void;
}

export const Body: FC<Props> = observer(({ order, orderBy, toggleDialog, candidates, interviewType }) => {
    const classes = useStyles();
    const { $candidate } = useStores();
    const [viewing, setViewing] = useState<Time[]>([]);

    const handleCheck = (id = '') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            $candidate.selectCandidate(id);
        } else {
            $candidate.deselectCandidate(id);
        }
    };
    const toggleViewing = (nextViewing: Time[]) => () => {
        setViewing(nextViewing);
    };

    return (
        <TableBody>
            {stableSort<Candidate>(candidates, compareCandidate(order, orderBy)).map(
                ({ rejected, abandon, name, group, _id, interviews }) => {
                    const { selection, allocation } = interviews[interviewType];
                    const slotInfo = allocation
                        ? new Date(allocation).toLocaleString('ja-JP', { hour12: false })
                        : '未分配';
                    const state = (
                        <div>
                            {rejected ? (
                                '已淘汰'
                            ) : abandon ? (
                                '已放弃'
                            ) : selection.length ? (
                                <Button color='primary' onClick={toggleViewing(selection)}>
                                    查看
                                </Button>
                            ) : (
                                '未选择'
                            )}
                        </div>
                    );
                    const button = (
                        <Button variant='contained' color='primary' onClick={toggleDialog(_id)}>
                            设置
                        </Button>
                    );
                    const items = [name, GROUPS[GROUPS_.indexOf(group)], slotInfo, state, button];
                    return (
                        <TableRow key={_id}>
                            <TableCell classes={{ root: classes.tableCell }} padding='checkbox'>
                                <Checkbox checked={$candidate.selected.has(_id)} onChange={handleCheck(_id)} />
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
                {viewing.map(({ date, afternoon, morning, evening }, index) => (
                    <div className={classes.textFieldContainer} key={index}>
                        <TextField
                            label='日期'
                            value={new Date(date).toLocaleDateString('zh-CN', {
                                hour12: false,
                            })}
                            className={classes.datePicker}
                        />
                        <TextField label='上午' value={morning ? '是' : '否'} className={classes.textField} />
                        <TextField label='下午' value={afternoon ? '是' : '否'} className={classes.textField} />
                        <TextField label='晚上' value={evening ? '是' : '否'} className={classes.textField} />
                    </div>
                ))}
            </Modal>
        </TableBody>
    );
});
