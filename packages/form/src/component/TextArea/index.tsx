import React, { FC, memo } from 'react';

import classNames from 'classnames';
import useStyles from '../../style/TextArea';

interface TextAreaProps {
    onChange: (e: React.ChangeEvent) => void;
}

const TextArea: FC<TextAreaProps> = memo(({ onChange }) => {
    const classes = useStyles();
    return (
        <div className={classNames(classes.container, classes.border, classes.font)}>
            <div className={classes.textLabel}>
                <div>自我介绍</div>
            </div>
            <textarea className={classes.textarea} onChange={onChange} />
        </div>
    );
});

export default TextArea;
