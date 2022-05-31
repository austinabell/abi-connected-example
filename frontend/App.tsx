import "regenerator-runtime/runtime";
import React, { useState, useEffect, FormEvent } from "react";
import Big from "big.js";
import Form from "./components/Form";
import { Account, WalletConnection } from "near-api-js";
import { Contract } from "near-abi-client";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

interface FormElements extends HTMLFormControlsCollection {
  fieldset: HTMLInputElement;
  message: HTMLInputElement;
}

interface AppState {
  contract: UndefinedContract;
  wallet: WalletConnection;
  account?: Account;
}

interface UndefinedContract extends Contract {
  // Allow any other types on the contract that are not defined.
  // This is ideally not needed when TS generated from ABI.
  [x: string]: any;
}

export default function App({ contract, wallet, account }: AppState) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      if (account?.accountId) {
        const status = await contract.get_status(account.accountId).view();

        setStatus(status);
      }
    }

    fetchStatus();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const { fieldset, message } = target.elements as FormElements;
    fieldset.disabled = true;

    await contract
      .set_status(message.value)
      .callFrom(account!, { gas: BOATLOAD_OF_GAS });

    const status = await contract.get_status(account!.accountId).view();

    setStatus(status);

    message.value = "";
    fieldset.disabled = false;
    message.focus();
  };

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

      {account?.accountId && <Form onSubmit={onSubmit} />}

      {status ? (
        <>
          <p>Your current status:</p>
          <p>
            <code>{status}</code>
          </p>
        </>
      ) : (
        <p>No status message yet!</p>
      )}
    </main>
  );
}
