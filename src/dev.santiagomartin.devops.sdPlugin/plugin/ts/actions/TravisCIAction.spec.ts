import { Bridge } from "../bridge/Bridge";
import { FakeBridge } from "../bridge/FakeBridge";
import { States } from "./Action";
import { TravisCIAction } from "./TravisCIAction";

const testBuilder = ({
  domain: customDomain,
  repo = "SantiMA10/devops-streamdeck",
  token = "token",
  response = { builds: [] },
  ok = true,
  status = 200,
  branch,
}: {
  domain?: string;
  repo?: string;
  token?: string;
  response?: object;
  ok?: boolean;
  status?: number;
  branch?: string;
} = {}) => {
  window.fetch = jest.fn(
    async () =>
      ({
        ok,
        status,
        json: async () => response,
      } as any)
  );

  const domain = customDomain || undefined;

  const subject = new TravisCIAction({
    bridge: new FakeBridge(),
    domain,
    repo,
    token,
    branch,
  });

  return { subject };
};

describe("TravisCIAction", () => {
  describe("#getState", () => {
    it("returns DEFAULT when the status is not 'passed' or 'errored'", async () => {
      const { subject } = testBuilder();

      const state = subject.getState({});

      expect(state).toEqual(States.DEFAULT);
    });

    it("returns SUCCESS when the status is 'passed'", async () => {
      const { subject } = testBuilder();

      const state = subject.getState({ status: "passed" });

      expect(state).toEqual(States.SUCCESS);
    });

    it("returns FAIL when the status is 'errored'", async () => {
      const { subject } = testBuilder();

      const state = subject.getState({ status: "errored" });

      expect(state).toEqual(States.FAIL);
    });
  });

  describe("#getUrl", () => {
    it("encodes the repository name in the URL", () => {
      const { subject } = testBuilder();

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("SantiMA10%2Fdevops-streamdeck")
      );
    });

    it("uses the default travis ci domain", () => {
      const { subject } = testBuilder();

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://api.travis-ci.org"));
    });

    it("uses the given travis ci domain", () => {
      const { subject } = testBuilder({ domain: "https://api.travis-ci.com" });

      const url = subject.getUrl();

      expect(url).toEqual(expect.stringContaining("https://api.travis-ci.com"));
    });

    it("calls the correct path", () => {
      const { subject } = testBuilder({ domain: "https://api.travis-ci.com" });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining("/repo/SantiMA10%2Fdevops-streamdeck/builds")
      );
    });

    it("adds the branch if the is present", () => {
      const { subject } = testBuilder({ branch: "dev" });

      const url = subject.getUrl();

      expect(url).toEqual(
        expect.stringContaining(
          "/repo/SantiMA10%2Fdevops-streamdeck/builds?branch.name=dev"
        )
      );
    });
  });

  describe("#isConfigured", () => {
    it("returns true when the token and repo are set", () => {
      const { subject } = testBuilder();

      const result = subject.isConfigured();

      expect(result).toEqual(true);
    });

    it("returns false when the token is empty", () => {
      const { subject } = testBuilder({ token: "" });

      const result = subject.isConfigured();

      expect(result).toEqual(false);
    });

    it("returns false when the repo is empty", () => {
      const { subject } = testBuilder({ repo: "" });

      const result = subject.isConfigured();

      expect(result).toEqual(false);
    });
  });

  describe("#load", () => {
    it("calls the Travis API with the token", async () => {
      const token = "token";
      const { subject } = testBuilder({ token });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: `token ${token}`,
          }),
        })
      );
    });

    it("calls the Travis API with the header version", async () => {
      const token = "token";
      const { subject } = testBuilder({ token });

      await subject.load();

      expect(window.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ "Travis-API-Version": "3" }),
        })
      );
    });

    it("calls the domain from getUrl method", async () => {
      const { subject } = testBuilder();

      await subject.load();

      expect(fetch).toHaveBeenCalledWith(subject.getUrl(), expect.anything());
    });

    it("returns status not found if there isn't any build", async () => {
      const { subject } = testBuilder();

      const { status } = await subject.load();

      expect(status).toEqual("not found");
    });

    it("returns status passed if that is the status of last build", async () => {
      const { subject } = testBuilder({
        response: {
          builds: [
            {
              "@type": "build",
              state: "passed",
            },
          ],
        },
      });

      const { status } = await subject.load();

      expect(status).toEqual("passed");
    });

    it("returns status errored if that is the status of last build", async () => {
      const { subject } = testBuilder({
        response: {
          builds: [
            {
              "@type": "build",
              state: "errored",
            },
          ],
        },
      });

      const { status } = await subject.load();

      expect(status).toEqual("errored");
    });

    it("returns status not found if the request status code is 404", async () => {
      const { subject } = testBuilder({
        ok: false,
        status: 404,
      });

      const { status } = await subject.load();

      expect(status).toEqual("not found");
    });

    it("returns status errored if the request fails", async () => {
      const { subject } = testBuilder({
        ok: false,
      });

      const { status } = await subject.load();

      expect(status).toEqual("errored");
    });
  });
});
