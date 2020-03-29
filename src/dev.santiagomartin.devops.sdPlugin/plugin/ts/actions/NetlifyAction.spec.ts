import { NetlifyAction } from "./NetlifyAction";
import { Bridge } from "../bridge/Bridge";

describe("NetlifyAction", () => {
  const siteId = "site-id";
  const token = "token";
  let bridge: Bridge;

  beforeEach(() => {
    window.fetch = jest.fn(
      async () =>
        ({
          json: async () => [{ state: "ok" }]
        } as any)
    );

    bridge = { setTitle: jest.fn() };
  });

  describe("#getUrl", () => {
    it("returns the site ID in the URL", () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining(siteId));
    });

    it("returns the full Netlify API url", () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      const url = subject.getUrl();

      expect(url).toEqual(
        `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
      );
    });

    it("returns the branch as query param if it is set", () => {
      const subject = new NetlifyAction({
        siteId,
        branch: "master",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("?branch=master"));
    });
  });

  describe("#load", () => {
    it("returns status as error if something went wrong with the request", async () => {
      window.fetch = () => {
        throw new Error();
      };
      const subject = new NetlifyAction({ siteId, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });

    it("returns 'not found' if there isn't any deployment", async () => {
      window.fetch = async () =>
        ({
          json: async () => []
        } as any);
      const subject = new NetlifyAction({ siteId, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("not found");
    });

    it("returns the state property of the first deploy", async () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("ok");
    });

    it("uses the url from 'getUrl'", async () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        subject.getUrl(),
        expect.any(Object)
      );
    });

    it("uses the given token in the request", async () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(expect.any(String), {
        headers: { authorization: `Bearer ${token}` }
      });
    });
  });

  describe("#onKeyUp", () => {
    it("sets the title to 'needs config' if the siteId is missing", async () => {
      const subject = new NetlifyAction({ siteId: null as any, token, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'needs config' if the token is missing", async () => {
      const subject = new NetlifyAction({ siteId, token: null as any, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'loading...' while loading", async () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "loading..." });
    });

    it("sets the title to the status from 'load' method", async () => {
      const subject = new NetlifyAction({ siteId, token, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "ok" });
    });
  });

  describe("#onWillAppear", () => {
    it("calls the 'onKeyUp' method", async () => {
      const subject = new NetlifyAction({
        siteId,
        token,
        bridge
      });
      const spy = jest.spyOn(subject, "onKeyUp");
      spy.mockImplementation(async () => {});

      await subject.onWillAppear();

      expect(spy).toHaveBeenCalled();
    });
  });
});
