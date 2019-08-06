import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar, setRecruitment } from '../../actions';
import { StoreState } from '../../reducers';

import Recruitment from '../../components/Recruitment';

const mapStateToProps =
    ({ recruitment: { recruitments, viewing }, user: { info: { group: userGroup, isAdmin, isCaptain } } }: StoreState) => ({
        data: recruitments.find(({ title }) => title === viewing)!,
        canLaunch: isCaptain || isAdmin,
        userGroup,
    });

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setRecruitment,
    enqueueSnackbar,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Recruitment);
