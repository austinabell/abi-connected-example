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
    const names: string[] = contract.abi.abi.functions.map((f) => f.name);
    wallet.requestSignIn(
      { contractId: contract.contractId, methodNames: names },
      "NEAR ABI"
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
        <h1>NEAR ABI</h1>

        {account?.accountId ? (
          <p>
            Currently signed in as: <code>{account?.accountId}</code>
          </p>
        ) : (
          <p>Please login to continue.</p>
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
