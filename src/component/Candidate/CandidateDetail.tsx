import * as React from "react";
import {
    Button,
    TextField,
    WithStyles,
    withStyles
} from "@material-ui/core";

import styles from "../../style";
import withRoot from "../../style/withRoot";
import Modal from '../Modal';

interface Props extends WithStyles {
    name: string
}

class CandidateDetail extends React.Component<Props> {
    state = {
        modalOpen: false,
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        const { classes, name } = this.props;
        return (
            <>
                <div className={classes.detail}>
                    <div className={classes.detailRow}>
                        <TextField
                            label="姓名"
                            defaultValue={name}
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any /* see https://github.com/mui-org/material-ui/issues/8047 */}
                        />
                        <TextField
                            label="组别"
                            defaultValue="web"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                        <TextField
                            label="性别"
                            defaultValue="男"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="学院"
                            defaultValue="计算机科学与技术学院"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                        <TextField
                            label="专业"
                            defaultValue="计算机科学与技术专业"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="年级"
                            defaultValue="大一"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                        <TextField
                            label="加权"
                            defaultValue="前100%"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <TextField
                            label="邮箱"
                            defaultValue="123456789@gmail.com"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                        <TextField
                            label="电话号码"
                            defaultValue="13333333333"
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            } as any}
                        />
                    </div>
                    <div className={classes.detailRow}>
                        <Button size="large" color='primary' onClick={this.toggleModalOpen}>
                            自我介绍
                        </Button>
                        <Button size="large" color='primary'>
                            简历下载
                        </Button>
                    </div>
                </div>
                <Modal open={this.state.modalOpen} onClose={this.toggleModalOpen} title='自我介绍'>
                    <div className={classes.modalContent}>
                        思想形成人的伟大。
                        <br />人只不过是一根苇草，是自然界最脆弱的东西；但他是一根能思想的苇草。用不着整个宇宙都拿起武器来才能毁灭；一口气、一滴水就足以致他死命了。然而，纵使宇宙毁灭了他，人却仍然要比致他于死命的东西更高贵得多；因为他知道自己要死亡，以及宇宙对他所具有的优势，而宇宙对此却是一无所知。
                        <br />因而，我们全部的尊严就在于思想。正是由于它而不是由于我们所无法填充的空间和时间我们才必须提高自己。因此，我们要努力好好地思想；这就是道德的原则。
                        <br />能思想的苇草——我应该追求自己的尊严，绝不是求之于空间，而是求之于自己的思想的规定。我占有多少土地都不会有用；由于空间，宇宙便囊括了我并吞没了我，有如一个质点；由于思想，我却囊括了宇宙。人既不是天使，又不是禽兽；但不幸就在于想表现为天使的人却表现为禽兽。
                        <br />思想——人的全部的尊严就在于思想。
                        <br />因此，思想由于它的本性，就是一种可惊叹的、无与伦比的东西。它一定得具有出奇的缺点才能为人所蔑视；然而它又确实具有，所以再没有比这更加荒唐可笑的事了。思想由于它的本性是何等地伟大啊！思想又由于它的缺点是何等地卑贱啊！
                        <br />然而，这种思想又是什么呢？它是何等地愚蠢啊！人的伟大之所以为伟大，就在于他认识自己可悲。一棵树并不认识自己可悲。因此，认识（自己）可悲乃是可悲的；然而认识我们之所以为可悲，却是伟大的。
                        <br />这一切的可悲其本身就证明了人的伟大。它是一位伟大君主的可悲是一个失了位的国王的可悲。我们没有感觉就不会可悲；一栋破房子就不会可悲。只有人才会可悲。
                    </div>
                </Modal>
            </>
        )
    }
}

export default withRoot(withStyles(styles)(CandidateDetail));