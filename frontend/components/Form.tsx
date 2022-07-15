import { ABIFunction, ABIParameterInfo, AnyContract } from "near-abi-client-js";
import { Account } from "near-api-js";
import React, { FormEvent, useState } from "react";

// Large amount to make sure things pass
const TX_GAS = 30_000_000_000_000;

interface FormParams {
  contract: AnyContract;
  account?: Account;
  func: ABIFunction;
}

export default function Form({ contract, account, func }: FormParams) {
  const [out, setOut] = useState<any>(undefined);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const elements = target.elements as any;
    elements.fieldset.disabled = true;

    // Collect all input from fields based on the order of params in ABI
    //? To be safe on this, we could assign it to an object. Order should be sufficient though
    let params: any[] = func.params
      ? func.params.map((p) => {
          const value = elements[p.name].value;
          if (p.type_schema.type === "integer") {
            return parseInt(value);
          } else if (p.type_schema.type === "string") {
            // Return value as is, already a string.
            return value;
          } else {
            return JSON.parse(value);
          }
        })
      : [];

    const method = contract[func.name](...params);
    let res;
    try {
      if (!func.is_view) {
        res = await method.callFrom(account!, {
          gas: TX_GAS,
        });
      } else {
        res = await method.view();
      }
      setOut(res);
    } catch (e: any) {
      setOut(`ERROR: ${e}`);
    }

    elements.fieldset.disabled = false;
  };

  func.params;

  const paramToField = (param: ABIParameterInfo) => {
    let label = "JSON";
    let field_type = "text";
    // Only changing field if a number, just for PoC, can be more robust.
    // Changes label to indicate what form is expecting.
    if (param.type_schema.type === "integer") {
      field_type = "number";
      label = "int";
    } else if (param.type_schema.type === "string") {
      label = "string";
    }

    return (
      <p className="highlight" key={param.name}>
        <label htmlFor="message">{param.name}</label>
        {/* TODO change this from just string input */}
        <input type={field_type} autoComplete="off" autoFocus id={param.name} />
      </p>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>{func.name}</p>
        {func.params ? func.params.map((p) => paramToField(p)) : undefined}
        <button type="submit">{func.is_view ? "View" : "Call"}</button>
        <p>{out}</p>
      </fieldset>
    </form>
  );
}
