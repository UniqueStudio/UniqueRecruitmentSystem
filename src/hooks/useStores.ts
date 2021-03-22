import { createContext, useContext } from 'react';

import { stores } from '@stores/index';

export const StoresContext = createContext(stores);

export const useStores = () => useContext(StoresContext);
