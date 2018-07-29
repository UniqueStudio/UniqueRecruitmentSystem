import { connect } from 'react-redux';
import Template, { CandidateInfo } from '../../component/Template';
import { toggleSnackbarOn, ToggleSnackbarOn, } from '../../action';
import { Dispatch } from 'redux';
import { sendSMS } from '../../action/async';

interface OwnProps {
    group: string;
    selected: CandidateInfo[];
    toggleOpen: () => void;
    deselect: (cid: string) => void;
}

type DispatchType = Dispatch<ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnProps) => ({
    toggleSnackbar: (info: string, color: string = 'info') => dispatch(toggleSnackbarOn(info, color)),
    sendSMS: (content: object) => sendSMS(content)(dispatch)
});

export default connect(null, mapDispatchToProps)(Template);