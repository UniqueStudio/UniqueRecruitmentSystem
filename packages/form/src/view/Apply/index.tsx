import * as React from 'react';
import logo from '../../asset/img/logo.png';
import header from '../../asset/img/header.png';
import Form from '../../component/Form';
import Time from '../../component/Time';

class Container extends React.Component {

    public render() {
        const params = window.location.pathname.split('/').splice(1);
        /* TODO */
        /* http://cvs.hustunique.com/form/:formId/:candidateId */
        /* formId: recruitmentId + groupId(if type === 1) + type(0: apply, 1: interview1, 2: interview2) */
        return (
            <div className='container'>
                <img src={logo} className='logo' />
                <div className='background' id='bgLeft' />
                <div className='center'>
                    <img src={header} className='header' />
                    <h1 className='title'>Unique Studio - 秋季招新</h1>
                        {params.length === 2 ? <Time /> : <Form />}
                </div>
                <div className='background' id='bgRight' />
            </div>
        );
    }
}

export default Container;
