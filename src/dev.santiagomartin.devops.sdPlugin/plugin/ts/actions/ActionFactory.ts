import { GitHubAction } from "./GitHubAction";
import { Bridge } from "../bridge/Bridge";
import { GitLabAction } from "./GitLabAction";
import { NetlifyAction } from "./NetlifyAction";

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
      case "dev.santiagomartin.devops.netlify.action":
        const netlifySettings = {
          branch: settings?.branch,
          token: settings?.token,
          siteId: settings?.repo
        };
        return new NetlifyAction({ ...netlifySettings, bridge });
    }
  }
}
