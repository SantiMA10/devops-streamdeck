import { Bridge } from "../bridge/Bridge";
import { Action, States } from "./Action";

interface Options {
  siteId: string;
  token: string;
  branch?: string;
  bridge: Bridge;
}

export class NetlifyAction extends Action {
  private siteId: string;
  private token: string;
  private branch?: string;

  public constructor({ siteId, branch, token, bridge }: Options) {
    super(bridge);
    this.siteId = siteId;
    this.branch = branch;
    this.token = token;
  }

  public getUrl() {
    const url = `https://api.netlify.com/api/v1/sites/${this.siteId}/deploys`;

    if (this.branch) {
      return `${url}?branch=${this.branch}`;
    }

    return url;
  }

  public async load() {
    try {
      const deploys = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      if (deploys.length === 0) {
        return { status: "not found" };
      }

      return { status: deploys[0].state };
    } catch {
      return { status: "error" };
    }
  }

  public isConfigured(): boolean {
    return !this.siteId || !this.token;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (!status) {
      return States.DEFAULT;
    }

    if (status === "ready") {
      return States.SUCCESS;
    }

    return States.FAIL;
  }
}
