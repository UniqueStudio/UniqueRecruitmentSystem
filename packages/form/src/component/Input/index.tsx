import React, { PureComponent } from 'react';

import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import borderStyles from '../../style/Border';
import inputStyles from '../../style/Input';
import combineStyles from '../../utils/combindStyles';

const styles = combineStyles(inputStyles, borderStyles);

interface Props extends WithStyles<typeof styles> {
    name: string;
    for: string;
    placeholder?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent) => void;
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    inputProps?: object;
}

class Input extends PureComponent<Props> {
    render() {
        const { for: htmlFor, name, onChange, placeholder, size, classes, inputProps } = this.props;

        return (
            <Grid classes={{ container: classes.root }} container spacing={0} alignItems='center'>
                <Grid classes={{ item: classes.item }} item xs={1} md={1}>
                    <InputLabel
                        classes={{ root: classNames(classes.label, classes.border, classes.labelText, classes.font) }}
                        htmlFor={htmlFor}
                    >
                        {name}
                    </InputLabel>
                </Grid>
                <Grid classes={{ item: classes.item }} item xs={size || 3}>
                    <InputBase
                        classes={{ root: classNames(classes.input, classes.border, classes.inputText, classes.font) }}
                        name={htmlFor}
                        id={htmlFor}
                        placeholder={placeholder}
                        onChange={onChange}
                        inputProps={inputProps}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Input);
