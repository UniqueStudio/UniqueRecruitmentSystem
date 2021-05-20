import { Paper, Tab } from '@material-ui/core';
import { TabContext, TabList, TabListProps, TabPanel } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';

import useStyles from '@styles/tabLayout';

interface Props {
    variant?: TabListProps['variant'];
    items: {
        label: string;
        value: string;
        component: JSX.Element;
    }[];
    classes?: {
        paper?: string;
    };
}

export const TabLayout: FC<Props> = ({ items, variant = 'standard', classes }) => {
    const defaultClasses = useStyles();
    const [tab, setTab] = useState(items[0].value);

    useEffect(() => {
        setTab(items[0].value);
    }, [items]);

    return items.find(({ value }) => value === tab) ? (
        <Paper className={classes?.paper}>
            <TabContext value={tab}>
                <TabList
                    onChange={(event, newValue) => setTab(newValue)}
                    centered={variant === 'standard'}
                    variant={variant}
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    {items.map(({ label, value }) => (
                        <Tab label={label} value={value} key={value} />
                    ))}
                </TabList>
                {items.map(({ value, component }) => (
                    <TabPanel value={value} key={value} classes={{ root: defaultClasses.tabPanel }}>
                        {component}
                    </TabPanel>
                ))}
            </TabContext>
        </Paper>
    ) : null;
};
