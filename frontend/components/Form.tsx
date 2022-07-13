import Big from "big.js";
import { ABIFunction } from "near-abi-client";
import { Account, WalletConnection } from "near-api-js";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { UndefinedContract } from "../App";

// Large amount to make sure things pass
const TX_GAS = Big(30_000_000_000_000);

interface FormParams {
  contract: UndefinedContract;
  account?: Account;
  func: ABIFunction;
}

export default function Form({ contract, account, func }: FormParams) {
  const [form, setForm] = useState({});
  const [out, setOut] = useState<any>(undefined);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const { fieldset, message } = target.elements as any;
    fieldset.disabled = true;

    await contract
      .set_status(message.value)
      .callFrom(account!, { gas: TX_GAS });

    const status = await contract.get_status(account!.accountId).view();

    setOut(status);

    message.value = "";
    fieldset.disabled = false;
    message.focus();
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>{func.name}</p>
        <p className="highlight">
          <label htmlFor="message">TODO</label>
          <input autoComplete="off" autoFocus id="message" required />
        </p>
        <button type="submit">Call</button>
        {/* TODO View button */}
        <p>{}</p>
      </fieldset>
    </form>
  );
}
