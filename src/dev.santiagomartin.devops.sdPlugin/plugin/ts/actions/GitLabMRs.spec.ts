import { GitLabMRs } from "./GitLabMRs";
import { Bridge } from "../bridge/Bridge";
import { FakeBridge } from "../bridge/FakeBridge";

describe("GitLabMRs", () => {
  const token = "token";
  let bridge: Bridge;

  beforeEach(() => {
    bridge = new FakeBridge();
  });

  describe("#getUrl", () => {

    it("uses the default GitLab domain if no other domain is give", () => {
      const subject = new GitLabMRs({
        token,
        bridge,
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://gitlab.com"));
    });

    it("uses the given custom GitLab domain", () => {
      const subject = new GitLabMRs({
        domain: "https://gitlab.santiagomartin.dev",
        token,
        bridge,
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("https://gitlab.santiagomartin.dev")
      );
    });

    it("generates the proper url to perform the request", () => {
      const subject = new GitLabMRs({
        token,
        bridge,
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        "https://gitlab.com/api/v4/merge_requests?scope=assigned_to_me&state=opened"
      );
    });
  });

  describe("#load", () => {
    beforeEach(() => {
      window.fetch = jest.fn(async () => ({
        json: async () => [{ status: "completed" }],
      })) as any;
    });

    it("calls the GitLab API with the token", async () => {
      const subject = new GitLabMRs({ token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(expect.any(String), {
        headers: { authorization: `Bearer ${token}` },
      });
    });

    it("uses the URL from 'getUrl' method", async () => {
      const subject = new GitLabMRs({ token, bridge });

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
      const subject = new GitLabMRs({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });

    it("returns the open MR count", async () => {
      const subject = new GitLabMRs({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("1 open MRs");
    });

    it("returns '0 open MRs' if the response contains 0 MRs", async () => {
      window.fetch = jest.fn(async () => ({
        json: async () => [],
      })) as any;
      const subject = new GitLabMRs({ token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("0 open MRs");
    });
  });

  describe("#onKeyUp", () => {
    it("sets the title to 'needs config' if the token is missing", async () => {
      const subject = new GitLabMRs({ token: null as any, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'loading...' while the information is loading", async () => {
      const subject = new GitLabMRs({ token, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "loading..." });
    });

    it("sets the title with the value returned by 'load' method", async () => {
      const subject = new GitLabMRs({ token, bridge });
      jest
        .spyOn(subject, "load")
        .mockImplementation(async () => ({ status: "ok" }));

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "ok" });
    });
  });

  describe("#onWillAppear", () => {
    it("calls the onKeyUp method", async () => {
      const subject = new GitLabMRs({ token, bridge });
      const spy = jest.spyOn(subject, "onKeyUp");
      spy.mockImplementation(async () => {});

      await subject.onWillAppear();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("#getDomain", () => {
    it("returns the default domain with postfix", () => {
      const subject = new GitLabMRs({ token, bridge });
      const uri = subject.getDomain("https://gitlab.com")

      expect(uri).toContain("/api/v4")
    });

    it("returns the default domain without double slashes", () => {
      const subject = new GitLabMRs({ token, bridge });
      const uri = subject.getDomain("https://gitlab.com/")

      expect(uri).toBe("https://gitlab.com/api/v4")
    });

    it("returns custom domain with postfix", () => {
      const subject = new GitLabMRs({ token, bridge });
      const uri = subject.getDomain("https://custom.gitlab.com")

      expect(uri).toContain("/api/v4")
    });

    it("returns custom domain without double slashes", () => {
      const subject = new GitLabMRs({ token, bridge });
      const uri = subject.getDomain("https://custom.gitlab.com/")

      expect(uri).toBe("https://custom.gitlab.com/api/v4")
    });
  });
});
