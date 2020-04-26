import React from "react";
import ReactDOM from "react-dom";
import { MainPI } from "./components/MainPI";

function connectElgatoStreamDeckSocket(
  inPort: any,
  inUUID: any,
  inRegisterEvent: any,
  inInfo: any,
  inActionInfo: any
) {
  const actionInfo = JSON.parse(inActionInfo);

  const websocket = new WebSocket("ws://localhost:" + inPort);

  websocket.onopen = function () {
    websocket.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inUUID,
      })
    );

    websocket.send(
      JSON.stringify({
        event: "getGlobalSettings",
        context: inUUID,
      })
    );
  };

  let globalSettings: any = {};

  websocket.addEventListener("message", function ({ data }) {
    const { event, payload } = JSON.parse(data);

    switch (event) {
      case "didReceiveGlobalSettings":
        globalSettings = payload.settings;
        break;
    }
  });

  document.addEventListener("saveAccount", (e) => {
    const { detail } = e as CustomEvent;

    globalSettings[`${detail.name}-${detail.token}-${detail.domain}`] = detail;

    websocket.send(
      JSON.stringify({
        event: "setGlobalSettings",
        context: inUUID,
        payload: globalSettings,
      })
    );
    websocket.send(
      JSON.stringify({
        event: "getGlobalSettings",
        context: inUUID,
        payload: globalSettings,
      })
    );
  });

  document.addEventListener("removeAccount", (e) => {
    const { detail } = e as CustomEvent;

    delete globalSettings[`${detail.key}`];

    websocket.send(
      JSON.stringify({
        event: "setGlobalSettings",
        context: inUUID,
        payload: globalSettings,
      })
    );
    websocket.send(
      JSON.stringify({
        event: "getGlobalSettings",
        context: inUUID,
        payload: globalSettings,
      })
    );
  });

  const settings = actionInfo.payload.settings;
  const save = ({ value, id }: { value: string; id: string }) => {
    actionInfo.payload.settings[id] = value;

    const json = {
      action: actionInfo.action,
      event: "setSettings",
      context: inUUID,
      payload: actionInfo.payload.settings,
    };

    websocket.send(JSON.stringify(json));
  };
  const openUrl = (url: string) => {
    websocket.send(
      JSON.stringify({
        event: "openUrl",
        payload: {
          url,
        },
      })
    );
  };

  const mountNode = document.getElementById("app");
  ReactDOM.render(
    <MainPI
      settings={settings}
      save={save}
      openUrl={openUrl}
      websocket={websocket}
      action={actionInfo.action}
    />,
    mountNode
  );
}

module.exports = connectElgatoStreamDeckSocket;
