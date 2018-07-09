import { connect } from 'react-redux';
import { StoreState } from '../reducer';
import Column from '../component/Column';

interface ownProps {
    title: string;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: ownProps) => ({
    candidates
});

export default connect(mapStateToProps)(Column);