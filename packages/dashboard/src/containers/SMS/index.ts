import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar, sendSMS } from '../../actions';

import SMSTemplate from '../../components/SMS';

import { Candidate } from '../../config/types';
import { StoreState } from '../../reducers';

interface OwnProps {
    selected: Candidate[];
    toggleOpen: () => void;
    deselect?: (cid: string) => void;
}

const mapStateToProps = (state: StoreState, ownProps: OwnProps) => ({
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            enqueueSnackbar,
            sendSMS,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps,
)(SMSTemplate);
