import * as React from 'react';
import classNames from 'classnames';
import logo from '../../asset/img/logo.png';
import header from '../../asset/img/header.png';
import borderTop from '../../asset/img/borderTop.png';
import Form from '../../component/Form';
import Time from '../../component/Time';

class Container extends React.Component {

    state = {
        isMobile: document.body.clientWidth < 500,
        submit: false
    };

    componentDidMount() {
        window.addEventListener('resize', this.checkMobile);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkMobile);
    }

    checkMobile = () => {
        this.setState({
            isMobile: document.body.clientWidth < 500
        })
    };
    submit = () => {
        this.setState({
            submit: true
        })
    };

    public render() {
        const { isMobile, submit } = this.state;
        const params = window.location.pathname.split('/').splice(1);
        /* TODO */
        /* http://cvs.hustunique.com/form/:formId/:candidateId */
        /* formId: recruitmentId + groupId(if type === 1) + type(0: apply, 1: interview1, 2: interview2) */
        const MobileInterface = (
            <>
                <img src={borderTop} className={classNames('borderTop', {'borderTopSubmitted': submit })} />
                <div className='fakeBorderContainer'>
                    <div className='borderVertical borderLeft' />
                    <div className='content'>
                        {params.length === 2 ? <Time isMobile={isMobile} /> : <Form submit={this.submit} isMobile={isMobile} />}
                    </div>
                    <div className='borderVertical borderRight' />
                </div>
                <img src={borderTop} className='borderBottom' />
            </>
        );
        const PCInterface = (
            <>
                <h1 className='title'>Unique Studio - 秋季招新</h1>
                {params.length === 2 ? <Time isMobile={isMobile} /> : <Form submit={this.submit} isMobile={isMobile} />}
            </>
        );
        return (
            <div className='container'>
                <img src={logo} className='logo' />
                <div className='background' id='bgLeft' />
                <div className='center'>
                    <img src={header} className='header' />
                    {isMobile ? <>
                        {params.length === 2 && <div className='titleContainer'>
                            <h1 className='title'>Unique Studio</h1>
                            <h1 className='title'>秋季招新</h1>
                        </div>}
                        {MobileInterface}
                    </> : PCInterface}
                </div>
                <div className='background' id='bgRight' />
            </div>
        );
    }
}

export default Container;
