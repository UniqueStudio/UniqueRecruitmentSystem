import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from "../../style/candidate";
import withRoot from "../../style/withRoot";
import Modal from '../Modal';
import { Candidate } from '../../lib/const';

interface Props extends WithStyles {
    info: Candidate,
    downloadResume: () => void;
}

class CandidateDetail extends PureComponent<Props> {
    state = {
        modalOpen: false,
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        const { classes, info, downloadResume } = this.props;
        const { name, group, sex, grade, institute, intro, mail, major, phone, score, time1, time2, abandon } = info;
        const inputProps = { readOnly: true };
        return (
            <>
                <div className={classes.detail}>
                    <div className={classes.detailRow}>
                        <TextField
                            label="姓名"
                            defaultValue={name}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="组别"
                            defaultValue={group}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="性别"
                            defaultValue={sex === 'Male' ? '男' : '女'}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="学院"
                            defaultValue={institute}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="专业"
                            defaultValue={major}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="年级"
                            defaultValue={grade}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="加权"
                            defaultValue={score}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="邮箱"
                            defaultValue={mail}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="电话号码"
                            defaultValue={phone}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="组面时间"
                            defaultValue={abandon ? '已放弃' : time1 ? '已决定' : '未决定'}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                        <TextField
                            label="群面时间"
                            defaultValue={abandon ? '已放弃' : time2 ? '已决定' : '未决定'}
                            margin="normal"
                            InputProps={{ inputProps }}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <Button size="large" color='primary' onClick={this.toggleModalOpen}>
                            自我介绍
                        </Button>
                        <Button size="large" color='primary' onClick={downloadResume}>
                            简历下载
                        </Button>
                    </div>
                </div>
                <Modal open={this.state.modalOpen} onClose={this.toggleModalOpen} title='自我介绍'>
                    <div className={classes.introContent}>
                        {intro.split('\n').filter(i => i).map((i, j) => (
                            <React.Fragment key={j}>
                                {i}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </Modal>
            </>
        )
    }
}

export default withRoot(withStyles(styles)(CandidateDetail));