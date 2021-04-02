import { Button, TextField, TextFieldProps } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, Fragment, useState } from 'react';

import { getResume } from '@apis/rest';
import { Modal } from '@components/Modal';
import { GENDERS, GRADES, GROUP_MAP, RANKS } from '@config/consts';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/detail';

interface Props {
    candidate: Candidate;
}

export const Detail: FC<Props> = observer(({ candidate }) => {
    const { $component } = useStores();
    const classes = useStyles();
    const [introModal, setIntroModal] = useState(false);

    const {
        id,
        name,
        group,
        gender,
        grade,
        institute,
        intro,
        mail,
        major,
        phone,
        rank,
        isQuick,
        referrer,
        resume,
    } = candidate;
    const progress = $component.resumeProgresses[id];

    const items: TextFieldProps[][] = [
        [
            { label: '姓名', value: name },
            { label: '组别', value: GROUP_MAP.get(group) },
            { label: '性别', value: GENDERS[gender] },
        ],
        [
            { label: '学院', value: institute },
            { label: '专业', value: major },
        ],
        [
            { label: '年级', value: GRADES[grade] },
            { label: '加权', value: RANKS[rank] },
        ],
        [
            { label: '邮箱', value: mail },
            { label: '电话号码', value: phone },
        ],
        [
            { label: '是否快通', value: isQuick ? '是' : '否' },
            { label: '推荐人', value: referrer || '无' },
        ],
        [{ label: '预览', value: intro, fullWidth: true, multiline: true, rowsMax: 3 }],
    ];

    const toggleIntroModalOpen = () => setIntroModal((prevModal) => !prevModal);

    const downloadResume = () => getResume(id);

    return (
        <>
            <div className={classes.detail}>
                {items.map((row, i) => (
                    <div className={classes.detailRow} key={i}>
                        {row.map((props, j) => (
                            <TextField margin='normal' key={j} InputProps={{ readOnly: true }} {...props} />
                        ))}
                    </div>
                ))}
                <div className={classes.detailRow}>
                    <Button size='large' color='primary' onClick={toggleIntroModalOpen}>
                        自我介绍
                    </Button>
                    <Button size='large' color='primary' onClick={downloadResume} disabled={!resume || !!progress}>
                        {progress ? `${(progress * 100).toFixed(2)}%` : '简历下载'}
                    </Button>
                </div>
            </div>
            <Modal open={introModal} onClose={toggleIntroModalOpen} title='自我介绍'>
                <div className={classes.introContent}>
                    {intro
                        .split('\n')
                        .filter(Boolean)
                        .map((text, index) => (
                            <Fragment key={index}>
                                {text}
                                <br />
                            </Fragment>
                        ))}
                </div>
            </Modal>
        </>
    );
});
