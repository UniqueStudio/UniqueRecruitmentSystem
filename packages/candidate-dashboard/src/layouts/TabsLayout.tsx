import { styled, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import React, { FC, useState, ReactElement, useEffect } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

const Panel = styled(TabPanel)(({ theme: { breakpoints, spacing } }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: spacing(150),
    marginLeft: 'auto',
    marginRight: 'auto',
    [breakpoints.down('xs')]: {
        padding: spacing(1),
    },
}));

interface Props {
    items: {
        component: ReactElement;
        value: string;
        label: string;
    }[];
}

export const TabsLayout: FC<Props> = ({ items }) => {
    const { url } = useRouteMatch();
    const tabs = items.map((i) => ({ ...i, url: `${url}/${i.value}` }));
    const routeMatch = useRouteMatch(tabs.map(({ url }) => url));
    const history = useHistory();

    useEffect(() => {
        if (!routeMatch && tabs.length) {
            history.push(tabs[0].url);
        }
    }, [routeMatch, tabs]);

    return routeMatch ? (
        <TabContext value={routeMatch.url}>
            <TabList centered scrollButtons allowScrollButtonsMobile>
                {tabs.map(({ label, url }) => (
                    <Tab key={url} label={label} value={url} component={Link} to={url} />
                ))}
            </TabList>
            <Switch>
                {tabs.map(({ url, component }) => (
                    <Route key={url} path={url}>
                        <Panel value={url}>{component}</Panel>
                    </Route>
                ))}
            </Switch>
        </TabContext>
    ) : null;
};
