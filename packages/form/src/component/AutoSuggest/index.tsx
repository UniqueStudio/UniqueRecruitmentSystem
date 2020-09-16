import React, { useState } from 'react';

import { MenuItem, MenuList, Paper } from '@material-ui/core';
import classNames from 'classnames';
import Autosuggest, { InputProps } from 'react-autosuggest';

import useStyles from '../../style/AutoSuggest';
import Input from '../Input';

export interface AutoSuggestProps<T> {
    id: string;
    value: string; // the input value
    items: T[]; // all suggestions list
    getItemValue: (value: T) => string;
    onChange: any; // function
    onSelect: (event: React.FormEvent, { suggestionValue }: { suggestionValue: string }) => void; // function when select a suggestion
    size?: number;
    labelSize?: number;
}

function AutoSuggest<T>(props: AutoSuggestProps<T>) {
    const { id, value, items, getItemValue, onChange, onSelect, size = 10, labelSize = 4 } = props;
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const classes = useStyles({ labelSize, suggestionLength: suggestions.length }) as any;

    const getSuggestions = (suggestion: string) => {
        return suggestion.length === 0
            ? []
            : items.filter(item => {
                  return (
                      getItemValue(item)
                          .toLowerCase()
                          .indexOf(suggestion.toLowerCase()) > -1
                  );
              });
    };

    const renderSuggestion = (item: T, { isHighlighted }: { isHighlighted: boolean }) => {
        const suggestion = getItemValue(item);
        const { menuItem, hightlightedItem, font } = classes;
        return (
            <MenuItem
                dense
                key={suggestion}
                classes={{ root: classNames(menuItem, font, { [hightlightedItem]: isHighlighted }) }}
                style={{ backgroundColor: isHighlighted ? '#E5F1FD' : 'transparent' }}
                component={'div' as any}
            >
                {suggestion}
            </MenuItem>
        );
    };

    const renderSuggestionsContainer = ({ containerProps, children, query }: any) => {
        return (
            <Paper {...containerProps}>
                <MenuList>{children}</MenuList>
            </Paper>
        );
    };

    const renderInputComponent = (inputProps: InputProps<T>) => {
        return <Input for={id} name={id} size={size} labelSize={labelSize} inputProps={inputProps} />;
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            inputProps={{ value, onChange }}
            onSuggestionsClearRequested={() => setSuggestions([])}
            onSuggestionsFetchRequested={({ value: k }) => setSuggestions(getSuggestions(k))}
            onSuggestionSelected={onSelect}
            getSuggestionValue={getItemValue}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            renderInputComponent={renderInputComponent}
            theme={{
                container: classes.container,
                suggestionsContainer: classes.suggestionsContainer,
                suggestionsList: classes.suggestionsList
            }}
        />
    );
}

export default AutoSuggest;
