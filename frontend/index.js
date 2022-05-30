import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js';
import { Contract } from 'near-abi-client';
import abi from '../res/metadata.json';

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    ...nearConfig
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = new Contract(near.connection, nearConfig.contractName, abi);

  return { contract, currentUser, nearConfig, walletConnection, account: walletConnection.account() };
}

window.nearInitPromise = initContract()
  .then(({ contract, currentUser, nearConfig, walletConnection, account }) => {
    ReactDOM.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
        account={account}
      />,
      document.getElementById('root')
    );
  });
