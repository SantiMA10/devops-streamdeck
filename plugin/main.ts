import { WebsocketBridge } from "./ts/bridge/WebsocketBridge";
import { ActionFactory } from "./ts/actions/ActionFactory";

var websocket: WebSocket | null = null;
var pluginUUID = null;

var DestinationEnum = Object.freeze({
  HARDWARE_AND_SOFTWARE: 0,
  HARDWARE_ONLY: 1,
  SOFTWARE_ONLY: 2
});

var timer;

function connectElgatoStreamDeckSocket(
  inPort,
  inPluginUUID,
  inRegisterEvent,
  inInfo
) {
  pluginUUID = inPluginUUID;

  // Open the web socket
  websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  function registerPlugin(inPluginUUID) {
    var json = {
      event: inRegisterEvent,
      uuid: inPluginUUID
    };

    websocket.send(JSON.stringify(json));
  }

  websocket.onopen = function() {
    // WebSocket is connected, send message
    registerPlugin(pluginUUID);
  };

  websocket.onmessage = function(evt) {
    const { event, action: actionName, context, payload } = JSON.parse(
      evt.data
    );
    const bridge = new WebsocketBridge({
      websocket: websocket as WebSocket,
      context: context
    });

    const action = ActionFactory.build({
      action: actionName,
      bridge,
      settings: payload?.settings
    });

    if (!action) {
      return bridge.setTitle({ title: "error" });
    }

    switch (event) {
      case "keyUp":
        return action.onKeyUp();
      case "willAppear":
        return action.onWillAppear();
    }
  };

  websocket.onclose = function() {
    // Websocket is closed
  };
}

module.exports = connectElgatoStreamDeckSocket;
