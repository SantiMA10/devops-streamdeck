import { Bridge } from "./Bridge";

export enum DestinationEnum {
  HARDWARE_AND_SOFTWARE = 0,
  HARDWARE_ONLY = 1,
  SOFTWARE_ONLY = 2,
}

export class WebsocketBridge implements Bridge {
  private websocket: WebSocket;
  private context: any;

  public constructor({
    websocket,
    context,
  }: {
    websocket: WebSocket;
    context: any;
  }) {
    this.websocket = websocket;
    this.context = context;
  }

  public setState({ state }: { state: number }): void {
    this.websocket.send(
      JSON.stringify({
        event: "setState",
        context: this.context,
        payload: {
          state,
          target: DestinationEnum.HARDWARE_AND_SOFTWARE,
        },
      })
    );
  }

  public setImage({ image }: { image: string }): void {
    this.websocket.send(
      JSON.stringify({
        event: "setImage",
        context: this.context,
        payload: {
          image,
          target: DestinationEnum.HARDWARE_AND_SOFTWARE,
        },
      })
    );
  }

  public setTitle({ title }: { title: string }): void {
    this.websocket.send(
      JSON.stringify({
        event: "setTitle",
        context: this.context,
        payload: {
          title,
          target: DestinationEnum.HARDWARE_AND_SOFTWARE,
        },
      })
    );
  }
}
