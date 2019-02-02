import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import { enqueueSnackbar, EnqueueSnackbar, sendSMS, SendSMS } from '../../actions';
import { StoreState } from '../../reducers';

import Template from '../../components/SMS';

import { Candidate } from '../../config/types';

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
