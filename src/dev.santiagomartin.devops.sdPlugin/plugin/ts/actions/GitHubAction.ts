import { Bridge } from "../bridge/Bridge";

interface Options {
  domain?: string;
  branch?: string;
  token: string;
  repo: string;
  bridge: Bridge;
}

export class GitHubAction {
  private domain: string;
  private token: string;
  private repo: string;
  private branch: string | undefined;
  private bridge: Bridge;

  public constructor({ domain, token, repo, branch, bridge }: Options) {
    this.domain = domain || "https://api.github.com";
    this.token = token;
    this.repo = repo;
    this.branch = branch;
    this.bridge = bridge;
  }

  public async load() {
    try {
      const { workflow_runs, total_count } = await fetch(this.getUrl(), {
        headers: { authorization: `Bearer ${this.token}` }
      }).then(res => res.json());

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

  public async onKeyUp() {
    if (!this.token || !this.repo) {
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
