import { ChangeEventHandler } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getVerifyCode } from '../../actions';

import { StoreState } from '../../reducers';

import Verify from '../../components/Verify';

interface OwnProps {
    code: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const mapStateToProps = (storeState: StoreState, ownProps: OwnProps) => ({
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            getVerifyCode,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Verify);
