var websocket = null;
var pluginUUID = null;

var DestinationEnum = Object.freeze({
  HARDWARE_AND_SOFTWARE: 0,
  HARDWARE_ONLY: 1,
  SOFTWARE_ONLY: 2
});

var timer;

class ActionFactory {
  static build(action) {
    switch (action) {
      case "dev.santiagomartin.devops.github.action":
        return new GitHubAction();
      case "dev.santiagomartin.devops.gitlab.action":
        return new GitLabAction();
    }
  }
}

class GitHubAction {
  type = "dev.santiagomartin.devops.github.action";

  async load(context, settings) {
    this.setTitle(context, "loading...");

    if (!settings.token || !settings.repo) {
      return this.setTitle(context, "error");
    }

    const { workflow_runs, total_count } = await fetch(this.getUrl(settings), {
      headers: { Authorization: `Bearer ${settings.token}` }
    }).then(res => res.json());

    if (total_count === 0) {
      return this.setTitle(context, "undefined");
    }

    this.setTitle(context, workflow_runs[0].status);
  }

  getUrl({ branch, repo }) {
    const baseUrl = `https://api.github.com/repos/${repo}/actions/runs`;

    if (branch) {
      return `${baseUrl}?branch=${branch}`;
    }

    return baseUrl;
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

class GitLabAction {
  type = "dev.santiagomartin.devops.gitlab.action";

  async load(context, settings) {
    const { token, repo } = settings;

    this.setTitle(context, "loading...");

    if (!token || !repo) {
      return this.setTitle(context, "error");
    }

    const pipelines = await fetch(this.getUrl(settings), {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    if (pipelines.length === 0) {
      return this.setTitle(context, "undefined");
    }

    this.setTitle(context, pipelines[0].status);
  }

  getUrl({ branch, repo }) {
    const baseUrl = `https://gitlab.com/api/v4/projects/${repo.replace(
      "/",
      "%2F"
    )}/pipelines`;

    if (branch) {
      return `${baseUrl}?ref=${branch}`;
    }

    return baseUrl;
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
    var context = jsonObj["context"];

    const action = ActionFactory.build(jsonObj["action"]);

    switch (event) {
      case "keyUp":
        var jsonPayload = jsonObj["payload"];
        var settings = jsonPayload["settings"];

        return action.onKeyUp(context, settings);
      case "willAppear":
        var jsonPayload = jsonObj["payload"];
        var settings = jsonPayload["settings"];

        return action.onWillAppear(context, settings);
    }
  };

  websocket.onclose = function() {
    // Websocket is closed
  };
}
