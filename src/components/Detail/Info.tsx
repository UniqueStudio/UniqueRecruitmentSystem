import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GENDERS, GRADES, RANKS } from '../../config/consts';
import { Candidate } from '../../config/types';
import styles from '../../styles/candidate';

import Modal from '../Modal';

interface Props extends WithStyles<typeof styles> {
    info: Candidate;
    getResume: (cid: string) => void;
    progress: number;
}

class Info extends PureComponent<Props> {
    state = {
        modalOpen: false,
    };

    toggleModalOpen = () => {
        this.setState(({ modalOpen }: { modalOpen: boolean }) => ({ modalOpen: !modalOpen }));
    };

    downloadResume = () => {
        this.props.getResume(this.props.info._id);
    };

    render() {
        const { classes, info, progress } = this.props;
        const { name, group, gender, grade, institute, intro, mail, major, phone, rank, isQuick, referrer, resume } = info;
        const inputProps = { readOnly: true };
        return (
            <>
                <div className={classes.detail}>
                    <div className={classes.detailRow}>
                        <TextField
                            label='姓名'
                            value={name}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='组别'
                            value={group}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='性别'
                            value={GENDERS[gender]}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label='学院'
                            value={institute}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='专业'
                            value={major}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label='年级'
                            value={GRADES[grade]}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='加权'
                            value={RANKS[rank]}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label='邮箱'
                            value={mail}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='电话号码'
                            value={phone}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label='是否快通'
                            value={isQuick ? '是' : '否'}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label='推荐人'
                            value={referrer || '无'}
                            margin='normal'
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <Button size='large' color='primary' onClick={this.toggleModalOpen}>
                            自我介绍
                        </Button>
                        <Button size='large' color='primary' onClick={this.downloadResume} disabled={!resume || !!progress}>
                            {progress ? `${(progress * 100).toFixed(2)}%` : `简历下载`}
                        </Button>
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label='预览'
                            value={intro}
                            InputProps={{ inputProps }}
                            fullWidth
                            multiline
                            rowsMax={3}
                        />
                    </div>
                </div>
                <Modal open={this.state.modalOpen} onClose={this.toggleModalOpen} title='自我介绍'>
                    <div className={classes.introContent}>
                        {intro.split('\n').filter((text) => text).map((text, index) => (
                            <React.Fragment key={index}>
                                {text}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </Modal>
            </>
        );
    }
}

export default withStyles(styles)(Info);
