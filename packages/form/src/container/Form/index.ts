import { connect } from 'react-redux';
import Form from '../../component/Form';
import { setInfo, SetInfo } from '../../action';
import { Dispatch } from 'redux';

type DispatchType = Dispatch<SetInfo>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    setInfo: (prop: object) => dispatch(setInfo(prop))
});

export default connect(null, mapDispatchToProps)(Form);
