import classNames from 'classnames';
import React, { ChangeEvent, FC, memo } from 'react';

import useStyles from '../../style/TextArea';

interface TextAreaProps {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<TextAreaProps> = memo(({ onChange }) => {
    const classes = useStyles() as any;
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
