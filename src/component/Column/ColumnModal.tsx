import * as React from "react";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Modal from '../Modal';
import Template from '../Template';
import styles from "../../style/index";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
    onClick: () => void;
    selected: string[],
    deselect: (cid: string[] | string) => void;
    step: string;
    group: string;
}

class ColumnModal extends React.PureComponent<Props> {

    state = {
        selected: this.props.selected
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            selected: nextProps.selected
        })
    }

    render() {
        const { open, toggleOpen, selected, deselect, step, group } = this.props;
        return (
            <Modal open={open} onClose={toggleOpen} title='发送通知'>
                <Template toggleOpen={toggleOpen}
                          selected={selected}
                          deselect={deselect}
                          flowStep={step}
                          group={group}
                />
            </Modal>
        );
    }
}

export default withRoot(withStyles(styles)(ColumnModal));
