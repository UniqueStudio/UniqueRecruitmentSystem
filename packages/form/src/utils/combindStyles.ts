import { Theme } from '@material-ui/core/styles';
import { Styles } from '@material-ui/core/styles/withStyles';
function combineStyles<
    ClassKey extends string,
    Props extends object = {}
>(...styles: Styles<Theme, Props, ClassKey>[] | any[]): Styles<Theme, Props, ClassKey> {
    return function CombineStyles(theme: any) {
        const outStyles = (styles as Styles<Theme, Props, ClassKey>[]).map((arg) => {
            // Apply the "theme" object for style functions.
            if (typeof arg === 'function') {
                return arg(theme);
            }
            // Objects need no change.
            return arg;
        });

        return outStyles.reduce((acc, val) => Object.assign(acc, val));
    };
}

export default combineStyles;
