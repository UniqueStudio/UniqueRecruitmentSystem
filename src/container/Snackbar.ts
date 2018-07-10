import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../reducer';
import { toggleSnackbarOn, ToggleSnackbarOn } from '../action';
import Snackbar from '../component/Snackbar';

const mapStateToProps = ({ componentsState }: StoreState) => ({
    on: componentsState.snackbar.on,
    info: componentsState.snackbar.info
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleSnackbarOn>) => ({
    toggleOn: () => dispatch(toggleSnackbarOn())
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);