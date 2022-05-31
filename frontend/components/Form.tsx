import React, { FormEventHandler } from 'react';

interface FormData {
  onSubmit: FormEventHandler<HTMLFormElement>,
}

export default function Form({ onSubmit }: FormData) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Add or update your status message!</p>
        <p className="highlight">
          <label htmlFor="message">Message:</label>
          <input
            autoComplete="off"
            autoFocus
            id="message"
            required
          />
        </p>
        <button type="submit">
          Update
        </button>
      </fieldset>
    </form>
  );
}
