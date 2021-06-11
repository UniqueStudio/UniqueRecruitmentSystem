import { Notifier } from '@uniqs/ui';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { useStores } from '@hooks/useStores';

export const Snackbars: FC = observer(() => {
    const { $component } = useStores();
    return (
        <Notifier notifications={toJS($component.snackbars)} onClose={(key) => $component.removeSnackbar(key)} />
    );
});
