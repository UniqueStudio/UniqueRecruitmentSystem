import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Template from '../../component/SMS';

import { sendSMS, SendSMS, toggleSnackbarOn, ToggleSnackbarOn } from '../../action';
import { StoreState } from '../../reducer';

import { Candidate } from '../../lib/const';

interface OwnProps {
    group: string;
    selected: Candidate[];
    toggleOpen: () => void;
    deselect: (cid: string) => void;
}

const mapStateToProps = ({ sms, recruitments }: StoreState, ownProps: OwnProps) => ({
    status: sms.status,
    pendingRecruitment: recruitments.pending,
    ...ownProps,
});

type DispatchType = Dispatch<ToggleSnackbarOn | SendSMS>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleSnackbar: (info: string, color: string = 'info') => dispatch(toggleSnackbarOn(info, color)),
    sendSMS: (content: object) => dispatch(sendSMS(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Template);
