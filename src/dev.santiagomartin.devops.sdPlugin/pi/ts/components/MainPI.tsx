import React, { useState, useEffect } from "react";

interface MainPIProps {
  action: string;
  save: (ops: { value: string; id: string }) => void;
  openUrl: (url: string) => void;
  websocket: WebSocket;
  settings: {
    account: string;
    repo: string;
    branch?: string;
  };
}

export const MainPI: React.FC<MainPIProps> = (props: MainPIProps) => {
  const { save, openUrl, settings, websocket, action } = props;

  const [accounts, setAccounts] = useState({} as any);
  const [account, setAccount] = useState(settings.account);
  const [repo, setRepo] = useState(settings.repo);
  const [branch, setBranch] = useState(settings.branch);

  const onMessage = function ({ data }: MessageEvent) {
    const { event, payload } = JSON.parse(data);

    switch (event) {
      case "didReceiveGlobalSettings":
        setAccounts(payload.settings);
        break;
    }
  };

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "Add") {
      return window.open("../setup/index.html");
    }

    setAccount(value);
    save({ value, id: "account" });
    const { token, domain } = accounts[event.target.value];
    save({ value: token, id: "token" });
    save({ value: domain, id: "domain" });
  };

  const onClickRemove = () => {
    document.dispatchEvent(
      new CustomEvent("removeAccount", { detail: { key: account } })
    );
  };

  useEffect(() => {
    websocket.addEventListener("message", onMessage);

    return () => websocket.removeEventListener("message", onMessage);
  });

  return (
    <div>
      <div className="sdpi-item">
        <label className="sdpi-item-label">account*</label>
        <select
          value={account}
          onChange={onSelectChange}
          className="sdpi-item-value select"
        >
          <option>No selected account</option>
          {Object.keys(accounts).map((account, index) => (
            <option key={index} value={account}>
              {accounts[account].name}
            </option>
          ))}
          <option disabled>--------------</option>
          <option value="Add">Add accounts</option>
        </select>
        <button
          disabled={account === "add"}
          onClick={onClickRemove}
          className="sdpi-item-value"
        >
          Remove
        </button>
      </div>

      {!(action.includes("notification") || action.includes("todos") || action.includes("mrs")) && (
      <div className="sdpi-item">
        <label className="sdpi-item-label">{getRepoLabel(action)}</label>
        <input
          className="sdpi-item-value"
          id="repo"
          type="text"
          required
          value={repo}
          onChange={(event) => {
            setRepo(event.target.value);
            save({ value: event.target.value, id: "repo" });
          }}
        />
      </div>
      )}

      {!(action.includes("vercel") || action.includes("notification") || action.includes("todos") || action.includes("mrs")) && (
        <div id="branch-group" className="sdpi-item">
          <label className="sdpi-item-label">branch</label>
          <input
            className="sdpi-item-value"
            id="branch"
            type="text"
            placeholder="leave it empty to show from all branches"
            value={branch}
            onChange={(event) => {
              setBranch(event.target.value);
              save({ value: event.target.value, id: "branch" });
            }}
          />
        </div>
      )}

      <div className="sdpi-item">
        <button
          className="sdpi-item-value"
          id="github"
          onClick={() =>
            openUrl("https://github.com/SantiMA10/devops-streamdeck")
          }
        >
          How it works?
        </button>
      </div>
    </div>
  );
};

const getRepoLabel = (action: string) => {
  if (action.includes("netlify")) {
    return "site id*";
  }

  if (action.includes("vercel")) {
    return "project name*";
  }

  return "username/repo*";
};
