import { GitHubAction } from "./GitHubAction";
import { Bridge } from "../bridge/Bridge";

describe("GitHubAction", () => {
  let bridge: Bridge;

  beforeEach(() => {
    bridge = { setTitle: jest.fn() };

    beforeEach(() => {
      window.fetch = jest.fn(
        async () =>
          ({
            json: async () => ({
              workflow_runs: [
                {
                  id: 60928826,
                  status: "completed"
                }
              ]
            })
          } as any)
      );
    });
  });

  describe("#getUrl", () => {
    it("returns the base with the repo name", () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("SantiMA10/devops-streamdeck")
      );
    });

    it("uses the default domain if we don't provide one", () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://api.github.com/"));
    });

    it("uses the given custom domain", () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        domain: "https://github.santiagomartin.dev",
        repo: "SantiMA10/devops-streamdeck"
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("https://github.santiagomartin.dev")
      );
    });

    it("makes the call to the proper GitHub API method", () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const url = subject.getUrl();

      expect(url).toEqual(
        "https://api.github.com/repos/SantiMA10/devops-streamdeck/actions/runs"
      );
    });

    it("adds the 'branch' query param if it receives it", () => {
      const subject = new GitHubAction({
        bridge,
        branch: "master",
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("?branch=master"));
    });
  });

  describe("#load", () => {
    it("calls the GitHub API with the 'token'", async () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: { authorization: "Bearer token" } })
      );
    });

    it("calls the proper url", async () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        subject.getUrl(),
        expect.any(Object)
      );
    });

    it("returns the pipeline status", async () => {
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const { status } = await subject.load();

      expect(status).toEqual("completed");
    });

    it("returns 'not found' if there 'total_count' is equal to 0", async () => {
      window.fetch = async () =>
        ({
          json: async () => ({
            total_count: 0
          })
        } as any);
      const subject = new GitHubAction({
        bridge,
        token: "token",
        repo: "SantiMA10/devops-streamdeck"
      });

      const { status } = await subject.load();

      expect(status).toEqual("not found");
    });

    it("returns an error status if something went wrong with the request", async () => {
      window.fetch = () => {
        throw new Error();
      };
      const subject = new GitHubAction({ bridge, repo: "", token: "" });

      const { status } = await subject.load();

      expect(status).toEqual("error");
    });
  });

  describe("#onKeyUp", () => {
    it("uses the 'Bridge' to set the title to 'loading' ", async () => {
      const subject = new GitHubAction({
        token: "token",
        repo: "devops-streamdeck",
        bridge
      });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "loading..." });
    });

    it("uses the 'Bridge' to set the title to the GitHub Action Status", async () => {
      const subject = new GitHubAction({
        token: "token",
        repo: "devops-streamdeck",
        bridge
      });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "completed" });
    });

    it("sets the title to 'needs config' if the token is missing", async () => {
      const subject = new GitHubAction({
        token: null as any,
        repo: "",
        bridge
      });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });

    it("sets the title to 'needs config' if the repo is missing", async () => {
      const subject = new GitHubAction({
        token: "",
        repo: null as any,
        bridge
      });

      await subject.onKeyUp();

      expect(bridge.setTitle).toHaveBeenCalledWith({ title: "needs config" });
    });
  });

  describe("#onWillAppear", () => {
    it("calls the 'onKeyUp' method", async () => {
      const subject = new GitHubAction({
        token: "token",
        repo: "devops-streamdeck",
        bridge
      });
      const spy = jest.spyOn(subject, "onKeyUp");
      spy.mockImplementation(async () => {});

      await subject.onWillAppear();

      expect(spy).toHaveBeenCalled();
    });
  });
});
