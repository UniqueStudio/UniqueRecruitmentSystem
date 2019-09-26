import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
// import borderTop from '../asset/img/borderTop.png';
import header from '../asset/img/headerFA.png';
import Dialog from '../component/Dialog';
import Form from '../component/Form';
import Loading from '../component/Loading';
import { NewTime } from '../component/NewTime';
import Snackbar from '../component/SnackBar';
// import Time from '../component/Time';
import { MEDIA, URL } from '../config/const';
import translate from '../config/translate';
import { Variant } from '../config/types';
import styles from '../style/view';
import { titleConverter } from '../utils/titleConverter';

interface Props extends WithStyles<typeof styles> {}

class Container extends PureComponent<Props> {
    state = {
        media: window.innerWidth < 600 ? MEDIA.Mobile : window.innerWidth < 1280 ? MEDIA.Pad : MEDIA.PC,
        submit: false,
        snackBarOn: '',
        title: '',
        variant: 'info' as Variant,
        loading: true,
        openDialog: true
    };

    toggleSnackbar = (content: string, variant: Variant) => {
        this.setState({
            snackBarOn: content,
            variant
        });
    };

    handleClose = () => {
        this.toggleSnackbar('', this.state.variant);
    };

    async componentDidMount() {
        window.addEventListener('resize', this.checkMobile);
        const result = await fetch(`${URL}/recruitment/pending`);
        const { type, data, message } = await result.json();
        if (type === 'success') {
            this.setState({ title: data[0] });
        } else {
            window.location.pathname === '/' && this.toggleSnackbar(translate(message), type);
        }
        this.setState({ loading: false });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkMobile);
    }

    checkMobile = () => {
        this.setState({
            media: window.innerWidth < 600 ? MEDIA.Mobile : window.innerWidth < 1280 ? MEDIA.Pad : MEDIA.PC
        });
    };

    submit = () => {
        this.setState({
            submit: true
        });
    };

    render() {
        const classes = this.props.classes;
        const { media, title, snackBarOn, variant, loading, openDialog } = this.state;
        const pathname = window.location.pathname;
        const titleName = titleConverter(title);
        /* http://join.hustunique.com/:formId/:candidateId */
        /* formId: recruitmentId + groupId(if type === 1) + type(0: apply, 1: interview1, 2: interview2) */
        const [isPC, isPad, isMobile] = [media === MEDIA.PC, media === MEDIA.Pad, media === MEDIA.Mobile];
        const main =
            pathname !== '/' ? (
                <NewTime isMobile={isMobile} toggleSnackbar={this.toggleSnackbar} />
            ) : (
                <Form
                    submit={this.submit}
                    isPC={isPC}
                    isPad={isPad}
                    isMobile={isMobile}
                    title={title}
                    toggleSnackbar={this.toggleSnackbar}
                />
            );

        const MainInterface = (
            <div>
                <div className={classes.title}>
                    {isMobile ? (
                        <>
                            <h1>Unique Studio</h1>
                            <h1>{titleName}</h1>
                        </>
                    ) : (
                        <h1>Unique Studio{titleName === '' ? '' : ` - ${titleName}`}</h1>
                    )}
                    {main}
                </div>
            </div>
        );

        const msg = (
            <>
                <span className={classes.msg}>
                    <span className={classNames('sp', 'sp2')}>很抱歉</span>，目前团队招新通道暂未开启。
                </span>
                <br />
                <span className={classes.msg}>
                    如有意向加入或咨询详细信息，可邮件团队
                    <a className={classNames('sp', 'sp1')} href="mailto:hr@hustunique.com">
                        邮箱
                    </a>
                    。我们会及时作出答复。
                </span>
            </>
        );

        return (
            <div className={classes.root}>
                <div className={classNames(classes.background, classes.bgLeft)} />
                <div className={classes.center}>
                    <img src={header} className={classes.header} alt="header" draggable={false} />
                    {MainInterface}
                </div>
                <div className={classNames(classes.background, classes.bgRight)} />
                <Snackbar open={snackBarOn !== ''} onClose={this.handleClose} content={snackBarOn} variant={variant} />
                <Loading open={loading} />
                <Dialog open={!loading && title === '' && pathname === '/' && openDialog} content={msg} title="" />
            </div>
        );
    }
}

export default withStyles(styles)(Container);
