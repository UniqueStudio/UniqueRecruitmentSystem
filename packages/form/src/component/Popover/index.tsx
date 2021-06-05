import classNames from 'classnames';
import React, { PureComponent } from 'react';

interface Props {
    on: boolean;
}

class Popover extends PureComponent<Props> {
    render() {
        return (
            <div className={classNames('popover', { popoverOn: this.props.on })}>
                <p>快速通道是独立于正常招新流程的一个招新方式，为有能力与基础的同学提供了一个快速进入团队的机会。</p>
                <p>若快速通道面试没有通过仍可以直接进入熬夜测试，有机会通过正常流程加入团队。</p>
                <p>快速通道的要求与正常通道无关且要比正常通道高。</p>
            </div>
        );
    }
}

export default Popover;
