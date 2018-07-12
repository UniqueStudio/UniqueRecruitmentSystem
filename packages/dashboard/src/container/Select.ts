import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setGroup, SetGroup } from '../action';
import Select from '../component/Select';

const mapDispatchToProps = (dispatch: Dispatch<SetGroup>) => ({
    setGroup: (group: string) => dispatch(setGroup(group))
});

export default connect(null, mapDispatchToProps)(Select);