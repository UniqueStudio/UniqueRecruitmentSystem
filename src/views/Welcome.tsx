import clsx from 'clsx';
import React, { FC, memo } from 'react';

import logo from '@images/logo.png';
import useStyles from '@styles/welcome';

interface Props {
    easterEgg?: boolean;
}

const Welcome: FC<Props> = memo(({ easterEgg = false }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <img src={logo} className={classes.logo} alt='logo' />
            {easterEgg && (
                <table className={clsx(classes.bgWhite, classes.table)}>
                    <tbody>
                        <tr className={clsx(classes.bold, classes.extraLarge)}>
                            <td className={clsx(classes.fgBlue)}>更</td>
                            <td className={clsx(classes.fgBlue)}>高</td>
                            <td className={clsx(classes.fgWhite, classes.bgBlue)}>更</td>
                            <td className={clsx(classes.fgWhite, classes.bgBlue)}>快</td>
                            <td className={clsx(classes.fgBlue)}>更</td>
                            <td className={clsx(classes.fgBlue)}>强</td>
                            <td className={clsx(classes.fgWhite, classes.bgBlue)}>更</td>
                            <td className={clsx(classes.fgWhite, classes.bgBlue)}>秀</td>
                        </tr>
                        <tr className={clsx(classes.alignBottom, classes.fgBlack)}>
                            {'联创808，亩产一千八，撒了金坷垃，亩产两千八'.split('，').map((i) => (
                                <td key={i} colSpan={2}>
                                    {i}
                                </td>
                            ))}
                        </tr>
                        <tr className={clsx(classes.bold, classes.extraLarge)}>
                            {'加快速度'.split('').map((i) => (
                                <td key={i} colSpan={2} className={clsx(classes.fgWhite, classes.bgRed)}>
                                    {i}
                                </td>
                            ))}
                        </tr>
                        <tr className={clsx(classes.bold, classes.large)}>
                            <td colSpan={8} className={clsx(classes.fgRed)}>
                                <div>做</div>
                                <div>社会主义</div>
                                <div>接班人</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
});

export default Welcome;
