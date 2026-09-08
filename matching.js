const SLACK_IDENTIFIERS = new Set([
  "slack",
  "slack_slack",
  "com.slack.slack",
]);

function normalizeIdentifier(value) {
  if (typeof value !== "string")
    return null;

  const normalized = value.trim().replace(/\.desktop$/i, "").toLowerCase();
  return normalized || null;
}

function readWindowIdentifier(window, getterName) {
  try {
    return window[getterName]?.call(window) ?? null;
  } catch {
    return null;
  }
}

export function getWindowIdentifiers(app, window) {
  const identifiers = [
    app?.id,
    window?.gtkApplicationId,
    window?.wmClass,
    readWindowIdentifier(window, "get_sandboxed_app_id"),
  ]
    .map(normalizeIdentifier)
    .filter(Boolean);

  return new Set(identifiers);
}

export function isSlackWindow(app, window) {
  return [...getWindowIdentifiers(app, window)].some(identifier =>
    SLACK_IDENTIFIERS.has(identifier));
}

export function sourceMatchesSlack(source, windowIdentifiers) {
  const policyId = normalizeIdentifier(source.policyId);
  if (policyId &&
      (SLACK_IDENTIFIERS.has(policyId) || windowIdentifiers.has(policyId)))
    return true;

  const icon = typeof source.icon === "string" ? source.icon.trim() : "";
  const iconId = normalizeIdentifier(icon);
  if (iconId &&
      (SLACK_IDENTIFIERS.has(iconId) || windowIdentifiers.has(iconId)))
    return true;

  if (/^\/snap\/slack\//i.test(icon))
    return true;

  return typeof source.title === "string" &&
    source.title.trim().toLowerCase() === "slack";
}
