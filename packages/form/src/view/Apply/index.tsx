import * as React from 'react';
import logo from '../../asset/img/logo.png';
import header from '../../asset/img/header.png';
import Form from '../../container/Form';
import Time from '../../component/Time';

class Container extends React.Component {
    public render() {
        return (
            <div className='container'>
                <img src={logo} className='logo' />
                <div className='background' id='bgLeft' />
                <div className='center'>
                    <img src={header} className='header' />
                    <h1 className='title'>Unique Studio - 秋季招新</h1>
                        {<Form /> || <Time /> || <Form />}
                </div>
                <div className='background' id='bgRight' />
            </div>
        );
    }
}

export default Container;
