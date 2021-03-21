import React, { FC, memo, useState } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Modal from '../Modal';

import { GENDERS, GRADES, GROUPS, GROUPS_, RANKS } from '../../config/consts';

import { Props } from '../../containers/Detail';

import useStyles from '../../styles/detail';

const Detail: FC<Props> = memo(({ info, downloadingResume, getResume }) => {
    const classes = useStyles();
    const [modal, setModal] = useState(false);

    const { cid, progress } = downloadingResume;
    const {
        _id,
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
    } = info;

    const items: {}[][] = [
        [
            { label: '姓名', value: name },
            { label: '组别', value: GROUPS[GROUPS_.indexOf(group)] },
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

    const toggleModalOpen = () => {
        setModal((prevModal) => !prevModal);
    };

    const downloadResume = () => {
        getResume(_id);
    };

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
                    <Button size='large' color='primary' onClick={toggleModalOpen}>
                        自我介绍
                    </Button>
                    <Button size='large' color='primary' onClick={downloadResume} disabled={!resume || !!progress}>
                        {progress ? (cid === _id ? `${(progress * 100).toFixed(2)}%` : '下载中') : '简历下载'}
                    </Button>
                </div>
            </div>
            <Modal open={modal} onClose={toggleModalOpen} title='自我介绍'>
                <div className={classes.introContent}>
                    {intro
                        .split('\n')
                        .filter((text) => text)
                        .map((text, index) => (
                            <React.Fragment key={index}>
                                {text}
                                <br />
                            </React.Fragment>
                        ))}
                </div>
            </Modal>
        </>
    );
});

export default Detail;
