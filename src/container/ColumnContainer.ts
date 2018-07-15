import { connect } from 'react-redux';
import ColumnContainer from '../component/Column/ColumnContainer';
import { StoreState } from '../reducer';

const mapStateToProps = ({ routerReducer, data }: StoreState) => ({
    isLoading: data.isLoading,
    pathname: routerReducer['location']['pathname']
});

export default connect(mapStateToProps)(ColumnContainer);