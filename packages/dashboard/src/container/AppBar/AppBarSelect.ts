import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import AppBarSelect from '../../component/AppBar/AppBarSelect';
import { requestCandidate } from '../../action/async';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeGroup: (group: string) => requestCandidate(group)(dispatch)
});

export default connect(null, mapDispatchToProps)(AppBarSelect);