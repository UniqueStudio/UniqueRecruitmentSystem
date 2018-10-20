import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Template from '../../container/SMS';
import Modal from '../Modal';

import { Candidate } from '../../lib/const';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
    selected: Candidate[];
    deselect: (cid: string[] | string) => void;
    group: string;
}

class ColumnModal extends PureComponent<Props> {

    static getDerivedStateFromProps(nextProps: Props) {
        return {
            selected: nextProps.selected,
        };
    }

    state = {
        selected: this.props.selected,
    };

    render() {
        const { open, toggleOpen, selected, deselect, group } = this.props;
        return (
            <Modal open={open} onClose={toggleOpen} title='发送通知'>
                <Template toggleOpen={toggleOpen}
                          selected={selected}
                          deselect={deselect}
                          group={group}
                />
            </Modal>
        );
    }
}

export default withStyles({})(ColumnModal);
