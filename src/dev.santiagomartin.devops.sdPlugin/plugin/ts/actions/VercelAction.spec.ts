import { FakeBridge } from "../bridge/FakeBridge";
import { VercelAction } from "./VercelActions";
import { States } from "./Action";

describe("VercelAction", () => {
  const bridge = new FakeBridge();

  describe("#isConfigured", () => {
    it("returns true if the settings contains url and token", () => {
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const result = subject.isConfigured();

      expect(result).toEqual(true);
    });

    it("return false if the url is missing", () => {
      const subject = new VercelAction({
        token: "token",
        url: null as any,
        bridge,
      });

      const result = subject.isConfigured();

      expect(result).toEqual(false);
    });

    it("return false if the token is missing", () => {
      const subject = new VercelAction({
        token: null as any,
        url: "url",
        bridge,
      });

      const result = subject.isConfigured();

      expect(result).toEqual(false);
    });

    it("return false if the token and url are missing", () => {
      const subject = new VercelAction({
        token: undefined as any,
        url: undefined as any,
        bridge,
      });

      const result = subject.isConfigured();

      expect(result).toEqual(false);
    });
  });

  describe("#getUrl", () => {
    it("returns the vercel api url", () => {
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const url = subject.getUrl();

      expect(url).toEqual(
        "https://api.vercel.com/v11/now/deployments/get?url=url"
      );
    });
  });

  describe("#getState", () => {
    it("returns State.SUCCESS if the status value is 'READY'", () => {
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const state = subject.getState({ status: "READY" });

      expect(state).toEqual(States.SUCCESS);
    });

    it("returns State.FAIL if the status value is 'ERROR'", () => {
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const state = subject.getState({ status: "ERROR" });

      expect(state).toEqual(States.FAIL);
    });

    it("returns State.DEFAULT if the status value is any other value", () => {
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const state = subject.getState({ status: "BUILDING" });

      expect(state).toEqual(States.DEFAULT);
    });
  });

  describe("#load", () => {
    it("returns error if something goes wrong with the request", async () => {
      window.fetch = jest.fn(() => {
        throw new Error("booom");
      });
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });

    it("returns 'READY' if the request contains 'READY' in 'readyState'", async () => {
      window.fetch = jest.fn(
        async () =>
          ({
            json: async () => ({ readyState: "READY" }),
          } as any)
      );
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const { status } = await subject.load();

      expect(status).toEqual("READY");
    });

    it("makes the request with the given token", async () => {
      window.fetch = jest.fn();
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ headers: { Authorization: "Bearer token" } })
      );
    });

    it("returns 'error' if there isn't any 'readyState' property in the response", async () => {
      window.fetch = jest.fn(
        async () =>
          ({
            json: async () => ({}),
          } as any)
      );
      const subject = new VercelAction({ token: "token", url: "url", bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });
  });
});
