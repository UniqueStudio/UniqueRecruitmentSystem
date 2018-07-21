import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import AppBarSelect from '../../component/AppBar/AppBarSelect';
import { requestCandidate } from '../../action/async';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ candidates }: StoreState) => ({
    group: candidates.group
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeGroup: (group: string) => requestCandidate(group)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBarSelect);