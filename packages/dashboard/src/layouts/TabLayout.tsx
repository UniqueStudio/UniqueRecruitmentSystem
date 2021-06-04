import { Paper, Tab } from '@material-ui/core';
import { TabContext, TabList, TabListProps, TabPanel } from '@material-ui/lab';
import React, { FC, useEffect } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

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
    const { url } = useRouteMatch();
    const tabs = items.map(({ value, ...props }) => ({ ...props, value: `${url}/${value}` }));
    const routeMatch = useRouteMatch(tabs.map(({ value }) => value));
    const history = useHistory();

    useEffect(() => {
        if (!routeMatch && tabs[0]) {
            history.push(tabs[0].value);
        }
    }, [routeMatch, tabs]);

    return routeMatch ? (
        <Paper className={classes?.paper}>
            <TabContext value={routeMatch.url}>
                <TabList
                    centered={variant === 'standard'}
                    variant={variant}
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    {tabs.map(({ label, value }) => (
                        <Tab label={label} value={value} key={value} component={Link} to={value} />
                    ))}
                </TabList>
                <Switch>
                    {tabs.map(({ value, component }) => (
                        <Route key={value} path={value}>
                            <TabPanel value={value} classes={{ root: defaultClasses.tabPanel }}>
                                {component}
                            </TabPanel>
                        </Route>
                    ))}
                </Switch>
            </TabContext>
        </Paper>
    ) : null;
};
