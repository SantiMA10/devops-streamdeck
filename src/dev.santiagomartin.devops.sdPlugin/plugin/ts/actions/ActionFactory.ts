import { GitHubAction } from "./GitHubAction";
import { Bridge } from "../bridge/Bridge";
import { GitLabAction } from "./GitLabAction";

interface Options {
  action: string;
  settings: {
    branch?: string;
    repo: string;
    token: string;
    domain?: string;
  };
  bridge: Bridge;
}

export class ActionFactory {
  static build({ action, settings, bridge }: Options) {
    switch (action) {
      case "dev.santiagomartin.devops.github.action":
        return new GitHubAction({ ...settings, bridge });
      case "dev.santiagomartin.devops.gitlab.action":
        return new GitLabAction({ ...settings, bridge });
    }
  }
}
