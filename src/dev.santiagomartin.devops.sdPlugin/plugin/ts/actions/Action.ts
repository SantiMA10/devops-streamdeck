import { Bridge } from "../bridge/Bridge";

export abstract class Action {
  public constructor(private bridge: Bridge) {}

  public abstract async load(): Promise<{ status: string }>;
  public abstract getUrl(): string;
  public abstract isConfigured(): boolean;

  public async onKeyUp() {
    if (this.isConfigured()) {
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
