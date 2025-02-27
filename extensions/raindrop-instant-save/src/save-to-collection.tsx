// https://github.com/raycast/extensions/tree/0a44df79436605e99e43783a2729a5ecfd514f49/extensions/raindrop-io
// https://developer.raindrop.io/v1/collections/methods
// [] Better display of collections/subcollections
// [] Add to collection
// [] Tags?
// [] Order by latest? (frecency?)
// [] Add file if finder in focus and file selected (instead of browser)
import { ActionPanel, Action, Icon, List, showHUD } from "@raycast/api";
import { useCollections } from "./hooks/useCollections";
import { addBookmark, addBookmarkToCollection } from "./lib/raindrop";
import { useEffect, useState } from "react";
import { Browser, browserSupported, extractUrl, getActiveTabByBrowser, getActiveWindow } from "./lib/window";
import { showFailureToast } from "@raycast/utils";
import { formatURL } from "./lib/utils";

export default function SaveToCollection() {
    const { data, isLoading } = useCollections();
    const [link, setLink] = useState("");

    useEffect(() => {
        async function getLink() {
            const activeWindow = await getActiveWindow();
            if (!activeWindow) return;

            if (!browserSupported(activeWindow)) {
                showFailureToast("Unsupported browser or application");
                return;
            }

            const activeTab = await getActiveTabByBrowser[activeWindow as Browser]();
            if (!activeTab) return;

            const url = extractUrl(activeTab);
            if (!url) return;

            setLink(url);
        }

        getLink();
    }, []);

    return (
        <List>
            {
                data?.items?.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()).map((collection) => (
                    <List.Item
                        key={collection._id}
                        title={collection.title}
                        subtitle={collection.count.toString()}
                        id={collection._id.toString()}
                        // accessories={[{ icon: Icon.Text, text: collection._id.toString() }]}
                        // icon={Icon.Emoji}
                        // keywords={[collection.title]}
                        // quickLook={ }
                        actions={
                            <ActionPanel>
                                {/* <Action.CopyToClipboard content={collection.title} /> */}
                                {/* custom action to add bookmark */}
                                <Action
                                    title="Add To Collection"
                                    onAction={async () => {
                                        await addBookmarkToCollection(link, collection._id);
                                        showHUD(`Added to Raindrop: ${formatURL(link)}`);
                                    }}
                                />
                                {/* <Action.CreateQuicklink title="Quicklink" quicklink={{ link: "", name: "", application: "" }} icon={Icon.Airplane} shortcut={{ modifiers: ["cmd"], key: ")" }} /> */}
                            </ActionPanel>
                        }
                        detail={
                            <List.Item.Detail
                                metadata={
                                    <List.Item.Detail.Metadata>
                                        <List.Item.Detail.Metadata.Label title="Type" icon="pokemon_types/grass.svg" text="Grass" />
                                        <List.Item.Detail.Metadata.Separator />
                                        <List.Item.Detail.Metadata.Label title="Type" icon="pokemon_types/poison.svg" text="Poison" />
                                    </List.Item.Detail.Metadata>
                                }
                            />
                        }
                    />
                ))
            }
            {
                isLoading && (
                    <List.Item
                        title="Loading..."
                        subtitle="Loading..."
                        accessories={[{ icon: Icon.Text, text: "Loading..." }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard content="Loading..." />
                            </ActionPanel>
                        }
                    />
                )
            }
            {
                !isLoading && (
                    <List.Item
                        title="No collections found"
                        subtitle="No collections found"
                        accessories={[{ icon: Icon.Text, text: "No collections found" }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard content="No collections found" />
                            </ActionPanel>
                        }
                    />
                )
            }
            {
                !isLoading && data?.items?.length === 0 && (
                    <List.Item
                        title="Add to collection"
                        subtitle="Add to collection"
                        accessories={[{ icon: Icon.Text, text: "Add to collection" }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard content="Add to collection" />
                            </ActionPanel>
                        }
                    />
                )
            }
            {
                !isLoading && data?.items?.length > 0 && (
                    <List.Item
                        title="No collections found"
                        subtitle="No collections found"
                        accessories={[{ icon: Icon.Text, text: "No collections found" }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard content="No collections found" />
                            </ActionPanel>
                        }
                    />
                )
            }
        </List >
    );
}

