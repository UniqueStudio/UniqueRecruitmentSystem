import { IconButton, InputAdornment, TextField, TextFieldProps, Typography } from '@material-ui/core';
import { Download } from '@material-ui/icons';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { getResume } from '@apis/rest';
import { Modal } from '@components/Modal';
import { GENDERS, GRADES, GROUP_MAP, RANKS } from '@config/consts';
import { Application } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/detail';

interface Props {
    application: Application;
}

class Row {
    constructor(public columns: TextFieldProps[], public className?: string) {}
}

export const Detail: FC<Props> = observer(({ application }) => {
    const { $component } = useStores();
    const classes = useStyles();
    const [introModal, setIntroModal] = useState(false);

    const { candidate, id, group, grade, institute, intro, major, rank, isQuick, referrer, resume } = application;
    const { name, gender, mail, phone } = candidate;
    const progress = $component.resumeProgresses[id];

    const toggleIntroModalOpen = () => setIntroModal((prevModal) => !prevModal);

    const downloadResume = () => getResume(id, resume);

    const rows = [
        new Row([
            { label: '姓名', value: name },
            { label: '组别', value: GROUP_MAP.get(group) },
            { label: '性别', value: GENDERS[gender] },
        ]),
        new Row([
            { label: '学院', value: institute },
            { label: '专业', value: major },
        ]),
        new Row([
            { label: '年级', value: GRADES[grade] },
            { label: '加权', value: RANKS[rank] },
        ]),
        new Row([
            { label: '邮箱', value: mail },
            { label: '电话号码', value: phone },
        ]),
        new Row(
            [
                { label: '是否快通', value: isQuick ? '是' : '否' },
                { label: '推荐人', value: referrer || '无' },
                {
                    label: '简历',
                    value: progress ? `${(progress * 100).toFixed(2)}%` : resume ?? '无',
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton onClick={downloadResume} disabled={!resume || !!progress}>
                                    <Download />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                },
            ],
            clsx(classes.detailRow, classes.resumeRow),
        ),
        new Row([
            {
                label: '自我介绍',
                value: intro,
                fullWidth: true,
                multiline: true,
                maxRows: 3,
                variant: 'outlined',
                InputProps: {
                    classes: {
                        root: classes.intro,
                        input: classes.intro,
                    },
                },
                onClick: toggleIntroModalOpen,
            },
        ]),
    ];

    return (
        <div>
            {rows.map(({ columns, className }, i) => (
                <div className={className ?? classes.detailRow} key={i}>
                    {columns.map((props, j) => (
                        <TextField
                            variant='standard'
                            margin='normal'
                            key={j}
                            {...props}
                            InputProps={{ ...props.InputProps, readOnly: true }}
                        />
                    ))}
                </div>
            ))}
            <Modal open={introModal} onClose={toggleIntroModalOpen} title='自我介绍'>
                <Typography variant='body1' className={classes.introContent}>
                    {intro}
                </Typography>
            </Modal>
        </div>
    );
});
