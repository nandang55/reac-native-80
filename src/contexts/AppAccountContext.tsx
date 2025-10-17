import { AccountResponse } from 'interfaces/AccountInterface';
import React, { createContext, useEffect, useReducer } from 'react';

type Account = AccountResponse | null;

interface State {
  account: Account;
  close?: boolean;
}

type Action =
  | { type: 'SetAccount'; payload: Account }
  | { type: 'RemoveAccount' }
  | { type: 'CloseAccount'; payload: boolean }
  | { type: 'RemoveCloseAccount' };

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const AccountContext = createContext({} as Props);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SetAccount': {
      return { ...state, account: action.payload };
    }
    case 'RemoveAccount': {
      return { ...state, account: null };
    }
    case 'CloseAccount': {
      return { ...state, close: action.payload };
    }
    case 'RemoveCloseAccount': {
      return { ...state, close: false };
    }
    default:
      return state;
  }
};

const AppAccountContext = ({ children }: { children: React.ReactNode }) => {
  const data = null;
  const [state, dispatch] = useReducer(reducer, {
    account: data,
    close: false
  });
  useEffect(() => {
    dispatch({ type: 'SetAccount', payload: data });
  }, [data]);
  return <AccountContext.Provider value={{ state, dispatch }}>{children}</AccountContext.Provider>;
};

export default AppAccountContext;
