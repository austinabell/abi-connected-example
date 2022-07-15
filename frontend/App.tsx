import "regenerator-runtime/runtime";
import React from "react";
import Form from "./components/Form";
import { Account, WalletConnection } from "near-api-js";
import { ABIFunction, AnyContract } from "near-abi-client-js";

interface AppState {
  contract: AnyContract;
  wallet: WalletConnection;
  account?: Account;
}

export default function App({ contract, wallet, account }: AppState) {
  const signIn = () => {
    wallet.requestSignIn(
      { contractId: contract.contractId, methodNames: ["set_status"] },
      "NEAR Status Message"
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  function abiFnToField(fn: ABIFunction) {
    return (
      <Form contract={contract} account={account} func={fn} key={fn.name} />
    );
  }

  const forms = contract.abi.abi.functions.map((f) => abiFnToField(f));

  return (
    <main>
      <header>
        <h1>NEAR Status Message</h1>

        {account?.accountId ? (
          <p>
            Currently signed in as: <code>{account?.accountId}</code>
          </p>
        ) : (
          <p>Update or add a status message! Please login to continue.</p>
        )}

        {account?.accountId ? (
          <button onClick={signOut}>Log out</button>
        ) : (
          <button onClick={signIn}>Log in</button>
        )}
      </header>

      {account?.accountId && <div>{forms}</div>}
    </main>
  );
}
