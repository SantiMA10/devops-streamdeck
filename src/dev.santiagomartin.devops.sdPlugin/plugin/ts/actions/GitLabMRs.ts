import { Bridge } from "../bridge/Bridge";
import { Action, States } from "./Action";

interface Options {
  token: string;
  domain?: string | undefined;
  bridge: Bridge;
}

export class GitLabMRs extends Action {
  private domain: string;
  private token: string;

  public constructor({ token, bridge, domain }: Options) {
    super(bridge);
    this.domain = this.getDomain(domain || "https://gitlab.com");
    this.token = token;
  }

  public async load() {
    try {
      const mergerequests: Array<{id: string}> = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      return { status: `${mergerequests.length} open MRs` };
    } catch {
      return { status: "error" };
    }
  }

  public getUrl() {
    const url = `${this.domain}/merge_requests?scope=assigned_to_me&state=opened`;

    return url;
  }

  public isConfigured(): boolean {
    return !!this.token;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (status === "0 open MRs") {
      return States.SUCCESS;
    }

    if (typeof status === "string" && status.includes("open MRs")) {
      return States.FAIL;
    }

    return States.DEFAULT;
  }

  public getDomain(domain: string): string {
    if(!domain.includes("api/v4")) {
      const url = new URL("/api/v4", domain);

      return url.href;
    }

    return domain;
  }
}
