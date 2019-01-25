import { removeSnackbar } from 'Actions';
import Notifier from 'Components/Notifier';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { StoreState } from 'Reducers';
import { bindActionCreators, Dispatch } from 'redux';

const mapStateToProps = ({ component }: StoreState) => ({
    notifications: component.snackbars,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ removeSnackbar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Notifier));
