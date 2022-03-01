import { Bridge } from "../bridge/Bridge";
import { Action, States } from "./Action";

interface Options {
  token: string;
  bridge: Bridge;
}

export class GitHubNotifications extends Action {
  private domain: string
  private token: string;

  public constructor({ token, bridge }: Options) {
    super(bridge);
    this.domain = "https://api.github.com";
    this.token = token;
  }

  public async load() {
    try {
      const { notifications } = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      return { status: `${notifications.length} new Notifications` };
    } catch {
      return { status: "error" };
    }
  }

  public getUrl() {
    const url = `${this.domain}/notifications`;

    return url;
  }

  public isConfigured(): boolean {
    return !!this.token;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (status === "0 new Notifications") {
      return States.SUCCESS;
    }

    if (typeof status === "string" && status.includes("new Notifications")) {
      return States.FAIL;
    }

    return States.DEFAULT;
  }
}
