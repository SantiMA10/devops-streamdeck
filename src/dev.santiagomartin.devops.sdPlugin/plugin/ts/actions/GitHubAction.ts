import { Bridge } from "../bridge/Bridge";
import { Action, States } from "./Action";

interface Options {
  domain?: string;
  branch?: string;
  token: string;
  repo: string;
  bridge: Bridge;
}

export class GitHubAction extends Action {
  private domain: string;
  private token: string;
  private repo: string;
  private branch: string | undefined;

  public constructor({ domain, token, repo, branch, bridge }: Options) {
    super(bridge);
    this.domain = domain || "https://api.github.com";
    this.token = token;
    this.repo = repo;
    this.branch = branch;
  }

  public async load() {
    try {
      const { workflow_runs, total_count } = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      if (total_count === 0) {
        return { status: "not found" };
      }

      return { status: workflow_runs[0].status };
    } catch {
      return { status: "error" };
    }
  }

  public getUrl() {
    const url = `${this.domain}/repos/${this.repo}/actions/runs`;

    if (this.branch) {
      return `${url}?branch=${this.branch}`;
    }

    return url;
  }

  public isConfigured(): boolean {
    return !this.token || !this.repo;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (!status) {
      return States.DEFAULT;
    }

    if (status === "completed") {
      return States.SUCCESS;
    }

    return States.FAIL;
  }
}
