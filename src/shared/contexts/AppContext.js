import React, { createContext, useContext, useReducer } from 'react';
import { appReducer } from './reducers/appReducer';
import defaultState from './reducers/appDefaultState';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, defaultState);

  return (
    <AppContext.Provider value={[appState, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
