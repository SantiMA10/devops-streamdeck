import { Bridge } from "./Bridge";

export enum DestinationEnum {
  HARDWARE_AND_SOFTWARE = 0,
  HARDWARE_ONLY = 1,
  SOFTWARE_ONLY = 2,
}

export class FakeBridge implements Bridge {
  public setImage = jest.fn();
  public setTitle = jest.fn();
}
