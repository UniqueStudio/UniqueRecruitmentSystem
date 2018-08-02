import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Modal from '../Modal';
import Template from '../../container/Template';
import withRoot from "../../style/withRoot";
import { Candidate } from '../../lib/const';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
    selected: Candidate[],
    deselect: (cid: string[] | string) => void;
    group: string;
}

class ColumnModal extends PureComponent<Props> {

    state = {
        selected: this.props.selected
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            selected: nextProps.selected
        })
    }

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

export default withRoot(withStyles({})(ColumnModal));
