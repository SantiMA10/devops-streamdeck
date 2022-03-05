import { GitHubNotifications } from "./GitHubNotifications";
import { Bridge } from "../bridge/Bridge";
import { FakeBridge } from "../bridge/FakeBridge";

describe("GitHubNotifications", () => {
  const token = "token";
  let bridge: Bridge;

  beforeEach(() => {
    bridge = new FakeBridge();
  });

  describe("#getUrl", () => {

    it("uses the default Github domain if no other domain is give", () => {
      const subject = new GitHubNotifications({
        token,
        bridge,
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://api.github.com"));
    });

    it("generates the proper url to perform the request", () => {
      const subject = new GitHubNotifications({
        token,
        bridge,
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        "https://api.github.com/notifications"
      );
    });
  });

  describe("#load", () => {
    beforeEach(() => {
      window.fetch = jest.fn(async () => ({
        json: async () => [{ status: "completed" }],
      })) as any;
    });

    it("calls the Github API with the token", async () => {
      const subject = new GitHubNotifications({ token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(expect.any(String), {
        headers: { authorization: `Bearer ${token}` },
      });
    });

    it("uses the URL from 'getUrl' method", async () => {
      const subject = new GitHubNotifications({ token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        subject.getUrl(),
        expect.any(Object)
      );
    });

    it("returns error as status if something fail with the request", async () => {
      window.fetch = jest.fn(() => {
        throw new Error("error");
      });
      const subject = new GitHubNotifications({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });

    it("returns the notification count", async () => {
      const subject = new GitHubNotifications({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("1 new Notif");
    });

    it("returns '0 new Notif' if the response contains 0 notifications", async () => {
      window.fetch = jest.fn(async () => ({
        json: async () => [],
      })) as any;
      const subject = new GitHubNotifications({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("0 new Notif");
    });
  });

  describe("#onKeyUp", () => {
    it("sets the title to 'needs config' if the token is missing", async () => {
      const subject = new GitHubNotifications({ token: null as any, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'loading...' while the information is loading", async () => {
      const subject = new GitHubNotifications({ token, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "loading..." });
    });

    it("sets the title with the value returned by 'load' method", async () => {
      const subject = new GitHubNotifications({ token, bridge });
      jest
        .spyOn(subject, "load")
        .mockImplementation(async () => ({ status: "ok" }));

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "ok" });
    });
  });

  describe("#onWillAppear", () => {
    it("calls the onKeyUp method", async () => {
      const subject = new GitHubNotifications({ token, bridge });
      const spy = jest.spyOn(subject, "onKeyUp");
      spy.mockImplementation(async () => {});

      await subject.onWillAppear();

      expect(spy).toHaveBeenCalled();
    });
  });
});
