import { ChangeEventHandler } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { allocateAllStart, allocateOneStart } from '../../actions';
import { StoreState } from '../../reducers';

import Table from '../../components/Table';
import { Candidate } from '../../config/types';

interface OwnProps {
    candidates: Candidate[];
    interviewType: 'group' | 'team';
    changeType: ChangeEventHandler<{ name?: string; value: unknown }>;
}

const mapStateToProps = (state: StoreState, ownProps: OwnProps) => ({
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            allocateOne: allocateOneStart,
            allocateAll: allocateAllStart,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Table);
