import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import AppBarSelect from '../../component/AppBar/AppBarSelect';
import { getCandidates, GetCandidates } from '../../action';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ candidates }: StoreState) => ({
    group: candidates.group
});

type DispatchType = Dispatch<GetCandidates>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => dispatch(getCandidates(group))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBarSelect);