import { Bridge } from "../bridge/Bridge";
import { Action } from "./Action";

interface Options {
  token: string;
  repo: string;
  domain?: string;
  branch?: string;
  bridge: Bridge;
}

export class GitLabAction extends Action {
  private token: string;
  private repo: string | undefined;
  private domain: string;
  private branch: string | undefined;

  public constructor({ token, repo, domain, branch, bridge }: Options) {
    super(bridge);
    this.token = token;
    this.repo = repo ? repo.replace(/\//g, "%2F") : undefined;
    this.domain = domain || "https://gitlab.com";
    this.branch = branch;
  }

  public async load() {
    try {
      const pipelines = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      if (pipelines.length === 0) {
        return { status: "not found" };
      }

      return { status: pipelines[0].status };
    } catch {
      return { status: "error" };
    }
  }

  public getUrl() {
    const url = `${this.domain}/api/v4/projects/${this.repo}/pipelines`;

    if (this.branch) {
      return `${url}?ref=${this.branch}`;
    }

    return url;
  }

  public isConfigured(): boolean {
    return !this.token || !this.repo;
  }
}
