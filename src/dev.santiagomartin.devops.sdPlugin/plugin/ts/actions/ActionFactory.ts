import { GitHubAction } from "./GitHubAction";
import { Bridge } from "../bridge/Bridge";
import { GitLabAction } from "./GitLabAction";
import { NetlifyAction } from "./NetlifyAction";
import { VercelAction } from "./VercelActions";
import { TravisCIAction } from "./TravisCIAction";
import { GitHubNotifications } from "./GitHubNotifications";
import { GitLabTodos } from "./GitLabTodos";
import { GitLabMRs } from "./GitLabMRs";

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
      case "dev.santiagomartin.devops.travis.action":
        return new TravisCIAction({ ...settings, bridge });
      case "dev.santiagomartin.devops.netlify.action":
        const netlifySettings = {
          branch: settings?.branch,
          token: settings?.token,
          siteId: settings?.repo,
        };
        return new NetlifyAction({ ...netlifySettings, bridge });
      case "dev.santiagomartin.devops.vercel.action":
        const vercelSettings = {
          token: settings?.token,
          name: settings?.repo,
        };
        return new VercelAction({ ...vercelSettings, bridge });
      case "dev.santiagomartin.devops.github.notifications":
        const ghNotificationsSettings = {
          token: settings?.token,
        };
        return new GitHubNotifications({ ...ghNotificationsSettings, bridge })
      case "dev.santiagomartin.devops.gitlab.todos":
        const glNotificationsSettings = {
          token: settings?.token,
          domain: settings?.domain,
        };
        return new GitLabTodos({ ...glNotificationsSettings, bridge })
      case "dev.santiagomartin.devops.gitlab.mrs":
        const glMRSettings = {
          token: settings?.token,
          domain: settings?.domain,
        };
        return new GitLabMRs({ ...glMRSettings, bridge })
    }
  }
}
