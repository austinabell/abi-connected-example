import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getConfig } from './config';
import * as nearAPI from 'near-api-js';
import { ABI, Contract } from 'near-abi-client-js';
import abi from '../res/abi.json';

//* This is a workaround to allow fields to be attached to the global window, which are used
//* with NEAR js API
declare global {
  interface Window {
    walletConnection: any;
    nearInitPromise: any;
    accountId: string;
    contract: any;
  }
}

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    headers: {},
    ...nearConfig
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near, null);

  // Initializing our contract APIs by contract name and configuration
  const contract = new Contract(near.connection, nearConfig.contractName, abi as ABI);

  return { contract, walletConnection, account: walletConnection?.account() };
}

window.nearInitPromise = initContract()
  .then(({ contract, walletConnection, account }) => {
    ReactDOM.render(
      <App
        contract={contract}
        wallet={walletConnection}
        account={account}
      />,
      document.getElementById('root')
    );
  });
