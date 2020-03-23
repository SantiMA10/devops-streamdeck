let websocket = null,
  uuid = null,
  actionInfo = {};

function connectElgatoStreamDeckSocket(
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo); // cache the info

  if (actionInfo.payload && actionInfo.payload.settings) {
    Object.keys(actionInfo.payload.settings).forEach(
      key =>
        (document.getElementById(key).value = actionInfo.payload.settings[key])
    );
  }
  websocket = new WebSocket("ws://localhost:" + inPort);

  websocket.onopen = function() {
    const json = {
      event: inRegisterEvent,
      uuid: inUUID
    };
    websocket.send(JSON.stringify(json));
  };
}

function onValueChange(value, id) {
  const json = {
    event: "setSettings",
    context: uuid,
    payload: {
      ...actionInfo.payload.settings,
      [id]: value
    }
  };

  websocket.send(JSON.stringify(json));
}

function openGitHub() {
  const json = {
    event: "openUrl",
    payload: {
      url: "https://github.com/SantiMA10/devops-streamdeck#how-it-works"
    }
  };

  websocket.send(JSON.stringify(json));
}
