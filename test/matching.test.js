import assert from "node:assert/strict";
import test from "node:test";

import {
  getWindowIdentifiers,
  isSlackWindow,
  sourceMatchesSlack,
} from "../matching.js";

function makeWindow(overrides = {}) {
  return {
    gtkApplicationId: null,
    wmClass: null,
    get_sandboxed_app_id: () => null,
    ...overrides,
  };
}

test("recognizes deb, snap, and Flatpak Slack windows", () => {
  assert.equal(isSlackWindow({id: "slack.desktop"}, makeWindow()), true);
  assert.equal(isSlackWindow({id: "slack_slack.desktop"}, makeWindow()), true);
  assert.equal(isSlackWindow(
    {id: "com.slack.Slack.desktop"},
    makeWindow({get_sandboxed_app_id: () => "com.slack.Slack"}),
  ), true);
});

test("rejects non-Slack windows", () => {
  assert.equal(isSlackWindow(
    {id: "org.mozilla.firefox.desktop"},
    makeWindow({wmClass: "firefox"}),
  ), false);
});

test("matches Slack notification policies", () => {
  const identifiers = new Set(["slack"]);
  assert.equal(sourceMatchesSlack(
    {policyId: "slack", icon: null, title: "Workspace"},
    identifiers,
  ), true);
});

test("matches Slack snap icon paths", () => {
  assert.equal(sourceMatchesSlack(
    {policyId: null, icon: "/snap/slack/225/meta/gui/slack.png", title: "Workspace"},
    new Set(["slack_slack"]),
  ), true);
});

test("uses exact Slack title only as a fallback", () => {
  assert.equal(sourceMatchesSlack(
    {policyId: null, icon: null, title: "Slack"},
    new Set(["slack"]),
  ), true);
  assert.equal(sourceMatchesSlack(
    {policyId: null, icon: null, title: "Slack-compatible client"},
    new Set(["slack"]),
  ), false);
});

test("rejects unrelated notification sources", () => {
  const identifiers = getWindowIdentifiers(
    {id: "slack.desktop"},
    makeWindow({wmClass: "Slack"}),
  );
  assert.equal(sourceMatchesSlack(
    {policyId: "org.gnome.Nautilus", icon: "org.gnome.Nautilus", title: "Files"},
    identifiers,
  ), false);
});
