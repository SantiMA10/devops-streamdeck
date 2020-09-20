import { Bridge } from "../bridge/Bridge";
import { Action, States } from "./Action";

type Options = {
  bridge: Bridge;
  domain?: string;
  repo: string;
  token: string;
  branch?: string;
};

export class TravisCIAction extends Action {
  private domain: string;
  private repo?: string;
  private branch?: string;
  private token: string;

  public constructor({ bridge, domain, repo, token, branch }: Options) {
    super(bridge);
    this.domain = domain || "https://api.travis-ci.org";
    this.repo = repo?.replace(/\//g, "%2F");
    this.token = token;
    this.branch = branch;
  }

  public async load(): Promise<{ status: string }> {
    const response = await fetch(this.getUrl(), {
      headers: {
        authorization: `token ${this.token}`,
        "Travis-API-Version": "3",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { status: "not found" };
      }

      return { status: "errored" };
    }

    const { builds } = await response.json();

    if (builds.length === 0) {
      return { status: "not found" };
    }

    return { status: builds[0].state };
  }

  public getUrl(): string {
    const base = `${this.domain}/repo/${this.repo}/builds`;

    if (this.branch) {
      return `${base}?branch.name=${this.branch}`;
    }

    return base;
  }

  public isConfigured(): boolean {
    return !!this.repo && !!this.token && this.token?.trim().length > 0;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (status === "passed") {
      return States.SUCCESS;
    }

    if (status === "errored") {
      return States.FAIL;
    }

    return States.DEFAULT;
  }
}
