import { GitLabAction } from "./GitLabAction";
import { Bridge } from "../bridge/Bridge";

describe("GitLabAction", () => {
  const repo = "SantiMA10/devops-streamdeck";
  const token = "token";
  let bridge: Bridge;

  beforeEach(() => {
    bridge = { setTitle: jest.fn() };
  });

  describe("#getUrl", () => {
    it("returns an URL with the given transformed repo", () => {
      const subject = new GitLabAction({
        repo: "SantiMA10/devops-streamdeck",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("SantiMA10%2Fdevops-streamdeck")
      );
    });

    it("uses the default GitLab domain if no other domain is give", () => {
      const subject = new GitLabAction({
        repo: "SantiMA10/devops-streamdeck",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://gitlab.com"));
    });

    it("uses the given custom GitLab domain", () => {
      const subject = new GitLabAction({
        repo: "SantiMA10/devops-streamdeck",
        domain: "https://gitlab.santiagomartin.dev",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("https://gitlab.santiagomartin.dev")
      );
    });

    it("uses the branch as query param if given", () => {
      const subject = new GitLabAction({
        repo: "SantiMA10/devops-streamdeck",
        branch: "master",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("?ref=master"));
    });

    it("generates the proper url to perform the request", () => {
      const subject = new GitLabAction({
        repo: "SantiMA10/devops-streamdeck",
        token,
        bridge
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        "https://gitlab.com/api/v4/projects/SantiMA10%2Fdevops-streamdeck/pipelines"
      );
    });
  });

  describe("#load", () => {
    beforeEach(() => {
      window.fetch = jest.fn(async () => ({
        json: async () => [{ status: "completed" }]
      })) as any;
    });

    it("calls the GitLab API with the token", async () => {
      const subject = new GitLabAction({ repo, token, bridge });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(expect.any(String), {
        headers: { authorization: `Bearer ${token}` }
      });
    });

    it("uses the URL from 'getUrl' method", async () => {
      const subject = new GitLabAction({ repo, token, bridge });

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
      const subject = new GitLabAction({ repo, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });

    it("returns the GitLab CI last status as status", async () => {
      const subject = new GitLabAction({ repo, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("completed");
    });

    it("returns 'not found' if the response contains 0 pipelines", async () => {
      window.fetch = jest.fn(async () => ({
        json: async () => []
      })) as any;
      const subject = new GitLabAction({ repo, token, bridge });

      const { status } = await subject.load();

      expect(status).toEqual("not found");
    });
  });

  describe("#onKeyUp", () => {
    it("sets the title to 'needs config' if the token is missing", async () => {
      const subject = new GitLabAction({ token: null as any, repo, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'needs config' if the repo is missing", async () => {
      const subject = new GitLabAction({ token, repo: null as any, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'loading...' while the information is loading", async () => {
      const subject = new GitLabAction({ token, repo, bridge });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "loading..." });
    });

    it("sets the title with the value returned by 'load' method", async () => {
      const subject = new GitLabAction({ token, repo, bridge });
      jest
        .spyOn(subject, "load")
        .mockImplementation(async () => ({ status: "ok" }));

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "ok" });
    });
  });

  describe("#onWillAppear", () => {
    it("calls the onKeyUp method", async () => {
      const subject = new GitLabAction({ token, repo, bridge });
      const spy = jest.spyOn(subject, "onKeyUp");
      spy.mockImplementation(async () => {});

      await subject.onWillAppear();

      expect(spy).toHaveBeenCalled();
    });
  });
});
