import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import React, { PureComponent } from 'react';
import Autocomplete from 'react-autocomplete';
import styles from '../../style/AutoSuggest';

interface Props extends WithStyles<typeof styles> {
    id: string;
    value: string; // the input value
    items: (string | object)[]; // all suggestions list
    getItemValue: (value: string | object) => string;
    onChange: any; // function
    onSelect: (value: string, item?: any) => void; // function when select a suggestion
}

class AutoSuggest extends PureComponent<Props> {
    shouldItemRender = (item: string | object, value: string) => {
        const val = this.props.getItemValue(item);
        return val.toLowerCase().indexOf(value.toLowerCase()) > -1;
    };

    renderItem = (item: string | object, isHighlighted: boolean) => {
        const suggestion = this.props.getItemValue(item);
        return (
            <MenuItem dense key={suggestion} style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent' }}>
                {suggestion}
            </MenuItem>
        );
    };

    renderInput = (props: React.HTMLProps<HTMLInputElement>) => {
        const id = this.props.id;
        return (
            <FormControl>
                <Input
                    id={id}
                    startAdornment={<InputAdornment position='start'>{id}</InputAdornment>}
                    inputProps={props}
                    margin='dense'
                />
            </FormControl>
        );
    };

    renderMenu = (items: React.ReactNode[], value: string, style: React.CSSProperties) => {
        console.log(style);
        return (
            <Paper classes={{ root: this.props.classes.menu }} style={{ display: items.length === 0 ? 'none' : '' }}>
                <MenuList children={items} />
            </Paper>
        );
    };

    render() {
        const { value, items, getItemValue, onChange, onSelect } = this.props;
        return (
            <Autocomplete
                items={items}
                value={value}
                getItemValue={getItemValue}
                onChange={onChange}
                onSelect={onSelect}
                shouldItemRender={this.shouldItemRender}
                renderItem={this.renderItem}
                renderInput={this.renderInput}
                renderMenu={this.renderMenu}
            />
        );
    }
}

export default withStyles(styles)(AutoSuggest);
