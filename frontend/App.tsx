import "regenerator-runtime/runtime";
import React, { useState, useEffect, FormEvent } from "react";
import Big from "big.js";
import Form from "./components/Form";
import { Account, WalletConnection } from "near-api-js";
import { Contract, ABIFunction } from "near-abi-client";


// interface FormElements extends HTMLFormControlsCollection {
//   fieldset: HTMLInputElement;
//   message: HTMLInputElement;
// }

interface AppState {
  contract: UndefinedContract;
  wallet: WalletConnection;
  account?: Account;
}

export interface UndefinedContract extends Contract {
  // Allow any other types on the contract that are not defined.
  // This is ideally not needed when TS generated from ABI.
  [x: string]: any;
}

export default function App({ contract, wallet, account }: AppState) {
  // const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   async function fetchStatus() {
  //     if (account?.accountId) {
  //       const status = await contract.get_status(account.accountId).view();

  //       setStatus(status);
  //     }
  //   }

  //   fetchStatus();
  // }, []);

  // const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const target = event.target as HTMLFormElement;
  //   const { fieldset, message } = target.elements as FormElements;
  //   fieldset.disabled = true;

  //   await contract
  //     .set_status(message.value)
  //     .callFrom(account!, { gas: BOATLOAD_OF_GAS });

  //   const status = await contract.get_status(account!.accountId).view();

  //   setStatus(status);

  //   message.value = "";
  //   fieldset.disabled = false;
  //   message.focus();
  // };

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
    const onSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
      };
    };
    return (
      <Form contract={contract} account={account} func={fn} />
    );
  }

  const forms = contract.abi?.methods.map((f) => abiFnToField(f));

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
      {/* {account?.accountId && <Form onSubmit={onSubmit} />} */}
    </main>
  );
}
