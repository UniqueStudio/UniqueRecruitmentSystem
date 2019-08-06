import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { setViewingRecruitmentStart } from '../../actions';

import { StoreState } from '../../reducers';

import Dashboard from '../../views/Dashboard';

const mapStateToProps = ({ recruitment: { recruitments: data, viewing } }: StoreState) => ({
    data,
    viewing,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setViewing: setViewingRecruitmentStart,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Dashboard);
