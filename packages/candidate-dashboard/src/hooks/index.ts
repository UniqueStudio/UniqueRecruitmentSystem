import { useEffect, useState } from 'react';

import { isMobile } from 'utils/ua';

export function useIsMobile() {
    const [value, setValue] = useState<boolean>(false);

    // since using ssr, run this in browser
    useEffect(() => {
        setValue(isMobile());
    }, []);

    return value;
}
