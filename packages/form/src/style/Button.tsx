import { makeStyles } from '@material-ui/core/styles';

import combineStyles from '../utils/combindStyles';

import borderStyles from './Border';
import fontStyles from './Font';
import heightStyles from './Height';

const styles = combineStyles(borderStyles, fontStyles, heightStyles);

export default makeStyles(styles);
