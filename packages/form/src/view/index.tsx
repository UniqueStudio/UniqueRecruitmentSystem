import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
// import borderTop from '../asset/img/borderTop.png';
import header from '../asset/img/header.png';
import logo from '../asset/img/logo.png';
import Form from '../component/Form';
import Loading from '../component/Loading';
import Snackbar from '../component/SnackBar';
import Time from '../component/Time';
import { MEDIA, URL } from '../config/const';
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
        loading: true
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
            this.toggleSnackbar(message, type);
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
        const { media, title, snackBarOn, variant, loading } = this.state;
        const params = window.location.pathname.split('/').splice(1);
        const titleName = titleConverter(title);
        /* http://join.hustunique.com/:formId/:candidateId */
        /* formId: recruitmentId + groupId(if type === 1) + type(0: apply, 1: interview1, 2: interview2) */
        const main =
            params.length === 2 ? (
                <Time media={media} isMobile={media === MEDIA.Mobile} toggleSnackbar={this.toggleSnackbar} />
            ) : (
                <Form
                    media={media}
                    submit={this.submit}
                    isMobile={media === MEDIA.Mobile}
                    title={title}
                    toggleSnackbar={this.toggleSnackbar}
                />
            );

        const MobileInterface = (
            <>
                {params.length === 2 && (
                    <div className='titleContainer'>
                        <h1 className='title'>Unique Studio</h1>
                        <h1 className='title'>{titleName}</h1>
                    </div>
                )}
                {main}
            </>
        );
        const PCInterface = (
            <>
                <h1 className='title'>Unique Studio - {titleName}</h1>
                {main}
            </>
        );
        return (
            <div className={classes.root}>
                <img src={logo} className={classes.logo} alt='logo' />
                <div className={classNames(classes.background, classes.bgLeft)} />
                <div className={classes.center}>
                    <img src={header} className={classes.header} alt='header' />
                    <div>{media === MEDIA.Mobile ? MobileInterface : PCInterface}</div>
                </div>
                <div className={classNames(classes.background, classes.bgRight)} />
                <Snackbar open={snackBarOn !== ''} onClose={this.handleClose} content={snackBarOn} variant={variant} />
                <Loading open={loading} />
            </div>
        );
    }
}

export default withStyles(styles)(Container);
