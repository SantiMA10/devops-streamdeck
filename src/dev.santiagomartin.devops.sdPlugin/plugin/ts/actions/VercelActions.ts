import { Action, States } from "./Action";
import { Bridge } from "../bridge/Bridge";

interface Options {
  token: string;
  url: string;
  bridge: Bridge;
}

export class VercelAction extends Action {
  private token: string;
  private url: string;

  public constructor({ token, url, bridge }: Options) {
    super(bridge);

    this.token = token;
    this.url = url;
  }

  public async load(): Promise<{ status: string }> {
    try {
      const { readyState } = await fetch(this.getUrl(), {
        headers: { Authorization: `Bearer ${this.token}` },
      }).then((res) => res.json());

      if (!readyState) {
        return { status: "error" };
      }

      return { status: readyState };
    } catch (e) {
      return { status: "error" };
    }
  }

  public getUrl(): string {
    return `https://api.vercel.com/v11/now/deployments/get?url=${this.url}`;
  }

  public isConfigured(): boolean {
    return !!this.url && !!this.token;
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
