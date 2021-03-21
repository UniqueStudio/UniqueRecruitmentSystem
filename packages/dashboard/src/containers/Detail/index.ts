import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getResume } from '../../actions';
import { StoreState } from '../../reducers';

import Detail from '../../components/Detail';

import { Candidate } from '../../config/types';

interface OwnProps {
    info: Candidate;
}

const mapStateToProps = (
    { candidate: { inputtingComment }, user: { info }, component: { resume } }: StoreState,
    ownProps: OwnProps,
) => ({
    downloadingResume: resume,
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            getResume,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Detail);
