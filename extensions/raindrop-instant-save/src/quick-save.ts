import { Toast, showToast } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { getActiveWindow, browserSupported, getActiveTabByBrowser, Browser, extractUrl } from "./lib/window";
import { addBookmark } from "./lib/raindrop";
import { formatURL } from "./lib/utils";

export default async function main() {
  const activeWindow = await getActiveWindow();

  if (!activeWindow) return;
  if (!browserSupported(activeWindow)) {
    showToast({
      style: Toast.Style.Failure,
      title: "Unsupported browser or application",
    });
    return;
  }

  const activeTab = await getActiveTabByBrowser[activeWindow as Browser]();
  if (!activeTab) return;

  const url = extractUrl(activeTab);
  if (!url) return;

  showToast({
    style: Toast.Style.Animated,
    title: `Saving to Raindrop...`,
  });

  try {
    const bookmark = await addBookmark(url);
    showToast({
      title: `Added to Raindrop: ${formatURL(url)}`,
      primaryAction: {
        title: "Open in Raindrop",
        onAction() {
          open(`https://app.raindrop.io/my/-1/item/${bookmark._id}`);
        },
        shortcut: {
          key: "o",
          modifiers: ["cmd"],
        },
      },
    });
  } catch (error) {
    showToast({
      style: Toast.Style.Failure,
      title: "Failed to save to Raindrop",
    });
  }
}
