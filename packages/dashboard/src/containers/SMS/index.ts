import { OptionsObject } from 'notistack';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { enqueueSnackbar, EnqueueSnackbar, sendSMS, SendSMS } from 'Actions';
import { StoreState } from 'Reducers';

import Template from 'Components/SMS';

import { Candidate } from 'Config/types';

interface OwnProps {
    selected: Candidate[];
    toggleOpen: () => void;
    deselect?: (cid: string) => void;
}

const mapStateToProps = ({ sms: { status } }: StoreState, ownProps: OwnProps) => ({
    status,
    ...ownProps,
});

type DispatchType = Dispatch<EnqueueSnackbar | SendSMS>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'info' }) => dispatch(enqueueSnackbar(message, options)),
    sendSMS: (content: object) => dispatch(sendSMS(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Template);
