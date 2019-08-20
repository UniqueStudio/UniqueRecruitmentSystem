import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyle from './Font';

const styles = combineStyles(borderStyles, fontStyle);

export default styles;
