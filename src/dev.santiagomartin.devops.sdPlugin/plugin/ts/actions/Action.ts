import { Bridge } from "../bridge/Bridge";

export enum States {
  DEFAULT = 2,
  SUCCESS = 0,
  FAIL = 1,
}

export abstract class Action {
  public constructor(private bridge: Bridge) {}

  public abstract load(): Promise<{ status: string }>;
  public abstract getUrl(): string;
  public abstract isConfigured(): boolean;
  public abstract getState(options: { status?: string }): number;

  public async onKeyUp() {
    if (!this.isConfigured()) {
      this.bridge.setState({ state: States.DEFAULT });
      return this.bridge.setTitle({ title: "needs config" });
    }

    this.bridge.setState({ state: States.DEFAULT });
    this.bridge.setTitle({ title: "loading..." });
    const { status } = await this.load();
    this.bridge.setState({ state: this.getState({ status }) });
    this.bridge.setTitle({ title: status });
  }

  public async onWillAppear() {
    await this.onKeyUp();
  }
}
