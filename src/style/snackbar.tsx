import { colorToShadow, dangerColor, infoColor, successColor, warningColor } from './index';
import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import mergeKV from '../lib/mergeKV';

const colorStyles = mergeKV(['info', 'success', 'warning', 'danger'],
    [infoColor, successColor, warningColor, dangerColor].map(i => ({
        background: i,
        color: 'white',
        boxShadow: colorToShadow(i),
    })));

const styles: StyleRulesCallback = () => ({
    ...colorStyles,
    iconButton: {
        fill: 'white'
    }
});

export default styles;