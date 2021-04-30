const core = require("@actions/core");
const github = require("@actions/github");

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context, undefined, 2);
  console.log(`The event context: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
