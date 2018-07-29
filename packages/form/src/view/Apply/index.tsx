import * as React from 'react';
import logo from '../../asset/img/logo.png';
import header from '../../asset/img/header.png';
import Form from '../../component/Form';
import Time from '../../component/Time';

class Container extends React.Component {
    constructor(props: {}) {
        super(props);
        // test form
        fetch('http://39.108.175.151:5000/form/5b5b1e1eb95a8219c85dd86e01')
            .then(res => res.json())
            .then(res => this.setState({
                time: res.time
            }));
    }

    state = {
        time: []
    };

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
                        {params.length === 2 ? <Time time={this.state.time}/> : <Form />}
                </div>
                <div className='background' id='bgRight' />
            </div>
        );
    }
}

export default Container;
