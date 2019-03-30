import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import { enqueueSnackbar, EnqueueSnackbar, sendSMS, SendSMS } from '../../actions';

import Template from '../../components/SMS';

import { Candidate } from '../../config/types';

interface OwnProps {
    selected: Candidate[];
    toggleOpen: () => void;
    deselect?: (cid: string) => void;
}

type DispatchType = Dispatch<EnqueueSnackbar | SendSMS>;

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnProps) => ({
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'info' }) => dispatch(enqueueSnackbar(message, options)),
    sendSMS: (content: object) => dispatch(sendSMS(content)),
    ...ownProps,
});

export default connect(null, mapDispatchToProps)(Template);
