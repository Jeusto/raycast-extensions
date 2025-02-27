import { runAppleScript } from "@raycast/utils";

export type Browser = "Google Chrome" | "Safari" | "firefox" | "Brave Browser" | "Arc";

export function getActiveWindow() {
  return runAppleScript(`tell application "System Events" to get name of (processes whose frontmost is true) as text`);
}

export const getActiveTabByBrowser = {
  "Google Chrome": () =>
    runAppleScript(`tell application "Google Chrome" to return {URL, title} of active tab of front window`),
  Arc: () => runAppleScript(`tell application "Arc" to return {URL, title} of active tab of front window`),
  Safari: () => runAppleScript(`tell application "Safari" to return {URL of front document, name of front document}`),
  firefox: () => {},
  "Brave Browser": () =>
    runAppleScript(`tell application "Brave Browser" to return {URL, title} of active tab of front window`),
} as const;

export const supportedBrowsers = Object.keys(getActiveTabByBrowser);

export function extractUrl(string: string) {
  const commaIndex = string.indexOf(",");
  const url = string.slice(0, commaIndex).trim();

  return url;
}

export function browserSupported(browser: string) {
  return supportedBrowsers.some((supportedBrowser) => supportedBrowser === browser);
}
