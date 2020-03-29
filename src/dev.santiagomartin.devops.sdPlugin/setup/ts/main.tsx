import React, { useState } from "react";
import ReactDOM from "react-dom";

const SetupForm: React.FC = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [domain, setDomain] = useState("");

  const onSave = () => {
    if (token && name) {
      window.opener.document.dispatchEvent(
        new CustomEvent("saveAccount", { detail: { name, token, domain } })
      );
    }

    window.close();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>DevOps for Stream Deck</h1>
      <p>
        If you need help to obtain your personal token, you can find the{" "}
        <a
          target="_blank"
          href="https://github.com/SantiMA10/devops-streamdeck#how-it-works"
        >
          instructions here
        </a>
        .
      </p>
      <div className="sdpi-item">
        <label className="sdpi-item-label">Name*</label>
        <input
          className="sdpi-item-value"
          type="text"
          placeholder="Account name"
          value={name}
          onChange={event => setName(event.target.value)}
          required
        />
      </div>
      <div className="sdpi-item">
        <label className="sdpi-item-label">Token*</label>
        <input
          className="sdpi-item-value"
          type="password"
          placeholder="Paste here your personal token"
          value={token}
          onChange={event => setToken(event.target.value)}
          required
        />
      </div>
      <div className="sdpi-item">
        <label className="sdpi-item-label">Domain (optional)</label>
        <input
          id="domain"
          type="text"
          placeholder="Add here your self-hosted domain"
          value={domain}
          onChange={event => setDomain(event.target.value)}
        />
      </div>
      <button style={{ marginTop: 10 }} onClick={onSave}>
        Add account
      </button>
    </div>
  );
};

var mountNode = document.getElementById("app");
ReactDOM.render(<SetupForm />, mountNode);
