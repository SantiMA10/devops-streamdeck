import { Bridge } from "../bridge/Bridge";

interface Options {
  siteId: string;
  token: string;
  branch?: string;
  bridge: Bridge;
}

export class NetlifyAction {
  private siteId: string;
  private token: string;
  private branch?: string;
  private bridge: Bridge;

  public constructor({ siteId, branch, token, bridge }: Options) {
    this.siteId = siteId;
    this.branch = branch;
    this.token = token;
    this.bridge = bridge;
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
        headers: { authorization: `Bearer ${this.token}` }
      }).then(res => res.json());

      if (deploys.length === 0) {
        return { status: "not found" };
      }

      return { status: deploys[0].state };
    } catch {
      return { status: "error" };
    }
  }

  public async onKeyUp() {
    if (!this.siteId || !this.token) {
      return this.bridge.setTitle({ title: "needs config" });
    }

    this.bridge.setTitle({ title: "loading..." });
    const { status } = await this.load();
    this.bridge.setTitle({ title: status });
  }

  public async onWillAppear() {
    await this.onKeyUp();
  }
}
