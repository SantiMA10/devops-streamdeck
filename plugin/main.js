/**
* MIT License
*
* Copyright (c) 2020 Santiago Martín
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
var websocket = null;
var pluginUUID = null;

var DestinationEnum = Object.freeze({
  HARDWARE_AND_SOFTWARE: 0,
  HARDWARE_ONLY: 1,
  SOFTWARE_ONLY: 2
});

var timer;

class GitHubAction {
  type = "dev.santiagomartin.devops.github.action";

  async load(context, settings) {
    this.setTitle(context, "loading...");

    if (!settings.token || !settings.repo) {
      return this.setTitle(context, "error");
    }

    const { workflow_runs, total_count } = await fetch(
      `https://api.github.com/repos/${settings.repo}/actions/runs`,
      {
        headers: { Authorization: `Bearer ${settings.token}` }
      }
    ).then(res => res.json());

    if (total_count === 0) {
      return this.setTitle(context, "undefined");
    }

    this.setTitle(context, workflow_runs[0].status);
  }

  onKeyUp(context, settings) {
    return this.load(context, settings);
  }

  onWillAppear(context, settings) {
    return this.load(context, settings);
  }

  setTitle(context, title) {
    var json = {
      event: "setTitle",
      context: context,
      payload: {
        title,
        target: DestinationEnum.HARDWARE_AND_SOFTWARE
      }
    };

    websocket.send(JSON.stringify(json));
  }
}

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
    // Received message from Stream Deck
    var jsonObj = JSON.parse(evt.data);
    var event = jsonObj["event"];
    var action = jsonObj["action"];
    var context = jsonObj["context"];

    switch (event) {
      case "keyUp":
        var jsonPayload = jsonObj["payload"];
        var settings = jsonPayload["settings"];

        return new GitHubAction().onKeyUp(context, settings);
      case "willAppear":
        var jsonPayload = jsonObj["payload"];
        var settings = jsonPayload["settings"];

        return new GitHubAction().onWillAppear(context, settings);
    }
  };

  websocket.onclose = function() {
    // Websocket is closed
  };
}
