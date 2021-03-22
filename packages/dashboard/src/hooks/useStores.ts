import { createContext, useContext } from 'react';

import { stores } from '../stores';

export const StoresContext = createContext(stores);

export const useStores = () => useContext(StoresContext);
