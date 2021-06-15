import { IconButton, Stack } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Done } from '@material-ui/icons';
import React, { FC, useState } from 'react';

import { SubList } from '@components/TransferList/SubList';

interface Props {
    l: [string, string][];
    r: [string, string][];
    disabled?: boolean;
    onSubmit: (l: string[], r: string[]) => void;
}

export const TransferList: FC<Props> = ({ l, r, disabled = false, onSubmit }) => {
    const [checkedL, setCheckedL] = useState(new Set<string>());
    const [checkedR, setCheckedR] = useState(new Set<string>());
    const [left, setLeft] = useState(new Map(l));
    const [right, setRight] = useState(new Map(r));

    const handleCheckedRight = () => {
        const newLeft = new Map(left);
        const newRight = new Map(right);
        for (const i of checkedL) {
            newRight.set(i, newLeft.get(i)!);
            newLeft.delete(i);
        }
        setLeft(newLeft);
        setRight(newRight);
        setCheckedL(new Set<string>());
    };

    const handleCheckedLeft = () => {
        const newLeft = new Map(left);
        const newRight = new Map(right);
        for (const i of checkedR) {
            newLeft.set(i, newRight.get(i)!);
            newRight.delete(i);
        }
        setLeft(newLeft);
        setRight(newRight);
        setCheckedR(new Set<string>());
    };

    const handleSubmit = () => {
        onSubmit([...left.keys()], [...right.keys()]);
    };

    return (
        <Stack direction='row' spacing={1}>
            <SubList title='选项' items={left} checked={checkedL} setChecked={setCheckedL} disabled={disabled} />
            <Stack spacing={1} justifyContent='center'>
                <IconButton size='small' onClick={handleCheckedRight} disabled={disabled || !checkedL.size}>
                    <ChevronRight />
                </IconButton>
                <IconButton size='small' onClick={handleCheckedLeft} disabled={disabled || !checkedR.size}>
                    <ChevronLeft />
                </IconButton>
                <IconButton size='small' onClick={handleSubmit} disabled={disabled}>
                    <Done />
                </IconButton>
            </Stack>
            <SubList title='已选' items={right} checked={checkedR} setChecked={setCheckedR} disabled={disabled} />
        </Stack>
    );
};
