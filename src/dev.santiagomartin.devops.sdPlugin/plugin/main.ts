import { WebsocketBridge } from "./ts/bridge/WebsocketBridge";
import { ActionFactory } from "./ts/actions/ActionFactory";

function connectElgatoStreamDeckSocket(
  inPort: string,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any
) {
  // Open the web socket
  const websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  function registerPlugin(inPluginUUID: string) {
    var json = {
      event: inRegisterEvent,
      uuid: inPluginUUID
    };

    websocket.send(JSON.stringify(json));
  }

  websocket.onopen = function() {
    // WebSocket is connected, send message
    registerPlugin(inPluginUUID);
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
