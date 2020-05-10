import { Action, States } from "./Action";
import { Bridge } from "../bridge/Bridge";

interface Options {
  token: string;
  name: string;
  bridge: Bridge;
}

export class VercelAction extends Action {
  private token: string;
  private name: string;

  public constructor({ token, name: url, bridge }: Options) {
    super(bridge);

    this.token = token;
    this.name = url;
  }

  public async load(): Promise<{ status: string }> {
    try {
      const { id: projectId } = await fetch(
        `https://api.vercel.com/v1/projects/${this.name}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      ).then((res) => res.json());
      const { deployments } = await fetch(
        `https://api.vercel.com/v5/now/deployments?projectId=${projectId}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      ).then((res) => res.json());

      if (deployments.length === 0) {
        return { status: "not found" };
      }

      return { status: deployments[0].state };
    } catch (e) {
      return { status: "error" };
    }
  }

  public getUrl(): string {
    throw new Error("Multiple URL");
  }

  public isConfigured(): boolean {
    return !!this.name && !!this.token;
  }

  public getState({ status }: { status?: string | undefined }): number {
    if (status === "READY") {
      return States.SUCCESS;
    }

    if (status === "ERROR") {
      return States.FAIL;
    }

    return States.DEFAULT;
  }
}
