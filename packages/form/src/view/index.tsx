import React, { PureComponent } from 'react';

import classNames from 'classnames';

import borderTop from '../asset/img/borderTop.png';
import header from '../asset/img/header.png';
import logo from '../asset/img/logo.png';
import Form from '../component/Form';
import SnackBar from '../component/SnackBar';
import Time from '../component/Time';
import { URL } from '../config/const';
import { titleConverter } from '../utils/titleConverter';

class Container extends PureComponent {

    state = {
        isMobile: document.body.clientWidth < 500,
        submit: false,
        snackBarOn: '',
        title: ''
    };

    toggleSnackbar = (content: string) => {
        this.setState({
            snackBarOn: content
        });
    };

    handleClose = () => {
        this.toggleSnackbar('');
    };

    async componentDidMount() {
        window.addEventListener('resize', this.checkMobile);
        const result = await fetch(`${URL}/recruitment/pending`);
        const { type, data } = await result.json();
        if (type === 'success') {
            this.setState({ title: data[0] });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkMobile);
    }

    checkMobile = () => {
        this.setState({
            isMobile: window.innerWidth <= 500
        });
    };

    submit = () => {
        this.setState({
            submit: true
        });
    };

    render() {
        const { isMobile, submit, title, snackBarOn } = this.state;
        const params = window.location.pathname.split('/').splice(1);
        const titleName = titleConverter(title);
        /* http://join.hustunique.com/:formId/:candidateId */
        /* formId: recruitmentId + groupId(if type === 1) + type(0: apply, 1: interview1, 2: interview2) */
        const main = params.length === 2
            ? <Time isMobile={isMobile} toggleSnackbar={this.toggleSnackbar} />
            : <Form submit={this.submit} isMobile={isMobile} title={title} toggleSnackbar={this.toggleSnackbar} />;
        const MobileInterface = (
            <>
                {params.length === 2 && <div className='titleContainer'>
                    <h1 className='title'>Unique Studio</h1>
                    <h1 className='title'>{titleName}</h1>
                </div>}
                <img src={borderTop} className={classNames('borderTop', { 'borderTopSubmitted': submit })} alt='border' />
                <div className='fakeBorderContainer'>
                    <div className='borderVertical borderLeft' />
                    <div className='content'>
                        {main}
                    </div>
                    <div className='borderVertical borderRight' />
                </div>
                <img src={borderTop} className='borderBottom' alt='border' />
            </>
        );
        const PCInterface = (
            <>
                <h1 className='title'>Unique Studio - {titleName}</h1>
                {main}
            </>
        );
        return (
            <div className='container'>
                <img src={logo} className='logo' alt='logo' />
                <div className='background' id='bgLeft' />
                <div className='center'>
                    <img src={header} className='header' alt='header' />
                    {isMobile ? MobileInterface : PCInterface}
                </div>
                <div className='background' id='bgRight' />
                {snackBarOn && <SnackBar content={snackBarOn} onClose={this.handleClose} />}
            </div>
        );
    }
}

export default Container;
