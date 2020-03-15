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
// this is our global websocket, used to communicate from/to Stream Deck software
// and some info about our plugin, as sent by Stream Deck software
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

window.addEventListener("pagehide", function(event) {
  sendValueToPlugin("propertyInspectorPagehide", "property_inspector");
});
