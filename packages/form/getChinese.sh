grep -ohPI '[\p{Han}]' -r $PATTERN ./src/* | tr -d '\n'
