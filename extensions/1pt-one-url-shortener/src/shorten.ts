import { LaunchProps, Clipboard, showToast, Toast, closeMainWindow } from "@raycast/api";
import fetch from "node-fetch";

export interface Arguments {
  url: string;
  alias: string;
}

export interface ShortenResponse {
  long_url: string;
  short_url: string;
  message: string;
}

const BASE_API_URL = "https://1pt.one/shorten";

export default async function main(props: LaunchProps) {
  const args: Arguments = props.arguments;
  const apiURL = args.alias
    ? `${BASE_API_URL}?short=${args.alias}&long=${args.url}`
    : `${BASE_API_URL}?long=${args.url}`;

  closeMainWindow();

  showToast({
    style: Toast.Style.Animated,
    title: `Shortening the URL...`,
  });

  const response = await fetch(apiURL);

  if (response.ok) {
    const json = (await response.json()) as ShortenResponse;
    Clipboard.copy("https://1pt.one/" + json.short_url);
    showToast({
      title: "URL shortened and copied to clipboard",
      style: Toast.Style.Success,
    });
  } else {
    showToast({
      title: "Failed to shorten the URL",
      style: Toast.Style.Failure,
    });
  }
}
