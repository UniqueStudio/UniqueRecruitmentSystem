import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { logout, setGroup, setSteps, toggleDrawer } from '../../actions';
import { StoreState } from '../../reducers';

import AppBar from '../../components/AppBar';

type OwnProps = RouteComponentProps;

const mapStateToProps = (
    { component: { drawerOpen }, user: { token }, candidate: { group, steps }, recruitment: { viewing } }: StoreState,
    ownProps: OwnProps,
) => ({
    open: drawerOpen,
    group,
    steps,
    title: viewing,
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            toggleDrawer,
            logout,
            setGroup,
            setSteps,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default withRouter(
    connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(AppBar),
);
