import React, { PureComponent } from 'react';

import { MenuItem, MenuList, Paper } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import Autosuggest from 'react-autosuggest';

import styles from '../../style/AutoSuggest';
import Input from '../Input';

interface Props extends WithStyles<typeof styles> {
    id: string;
    value: string; // the input value
    items: (string | object)[]; // all suggestions list
    getItemValue: (value: string | object) => string;
    onChange: any; // function
    onSelect: (event: React.FormEvent, { suggestionValue }: { suggestionValue: string }) => void; // function when select a suggestion
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

class AutoSuggest extends PureComponent<Props> {
    state = {
        suggestions: []
    };

    getSuggestions = (value: string) => {
        return value.length === 0
            ? []
            : this.props.items.filter((item) => {
                  return (
                      this.props
                          .getItemValue(item)
                          .toLowerCase()
                          .indexOf(value.toLowerCase()) > -1
                  );
              });
    };

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    renderSuggestion = (item: string | object, { isHighlighted }: { isHighlighted: boolean }) => {
        const suggestion = this.props.getItemValue(item);
        const { menuItem, hightlightedItem } = this.props.classes;
        return (
            <MenuItem
                dense
                key={suggestion}
                classes={{ root: classNames(menuItem, { [hightlightedItem]: isHighlighted }) }}
                style={{ backgroundColor: isHighlighted ? '#E5F1FD' : 'transparent' }}
                component={'div' as any}
            >
                {suggestion}
            </MenuItem>
        );
    };

    renderSuggestionsContainer = ({ containerProps, children, query }: any) => {
        return (
            <Paper {...containerProps} style={{ display: this.state.suggestions.length ? '' : 'none' }}>
                <MenuList>{children}</MenuList>
            </Paper>
        );
    };

    renderInputComponent = (inputProps: object) => {
        const { id, size } = this.props;
        return <Input for={id} name={id} size={size || 10} inputProps={inputProps} />;
    };

    render() {
        const { value, getItemValue, onChange, classes, onSelect } = this.props;
        return (
            <Autosuggest
                suggestions={this.state.suggestions}
                inputProps={{ value, onChange }}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionSelected={onSelect}
                getSuggestionValue={getItemValue}
                renderSuggestion={this.renderSuggestion}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                renderInputComponent={this.renderInputComponent}
                theme={{
                    container: classes.container,
                    suggestionsContainer: classes.suggestionsContainer,
                    suggestionsList: classes.suggestionsList
                }}
            />
        );
    }
}

export default withStyles(styles)(AutoSuggest);
