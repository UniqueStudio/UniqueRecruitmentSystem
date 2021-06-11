import { DependencyList, useEffect } from 'react';

export const useAsyncEffect = <T>(effect: () => Promise<T>, deps?: DependencyList) => {
    useEffect(() => {
        void (async () => await effect())();
    }, deps);
};
