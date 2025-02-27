import { MenuBarExtra, Icon, Color, launchCommand, LaunchType } from "@raycast/api";
import { YabaiCommands, runYabaiCommand } from "./lib/yabai";
import { useCachedState } from "@raycast/utils";
import { useEffect } from "react";

export default function Command() {
    const [yabaiEnabled, setYabaiEnabled] = useCachedState("yabaiEnabled", true)
    // run command `pgrep -x yabai` to check if yabai is running
    // if it is, then set yabaiEnabled to true
    // else, set yabaiEnabled to false

    return (
        <MenuBarExtra icon={yabaiEnabled ? "https://api.iconify.design/material-symbols:window-outline-sharp.svg" : "https://api.iconify.design/material-symbols-light:disabled-by-default.svg"}
            tooltip="Your Pull Requests">
            <MenuBarExtra.Section>
                <MenuBarExtra.Item title={`Yabai ${yabaiEnabled ? 'enabled' : 'disabled'}`}
                    icon={{ source: Icon.Tray, tintColor: Color.Red }}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                    onAction={() => launchCommand({ name: "restart", type: LaunchType.UserInitiated })}
                />
            </MenuBarExtra.Section>
            <MenuBarExtra.Section title="Section">
                <MenuBarExtra.Submenu title="Submenu">
                    <MenuBarExtra.Item title="Seen" icon={Icon.Circle} />
                </MenuBarExtra.Submenu>
            </MenuBarExtra.Section>
            <MenuBarExtra.Section>
                <MenuBarExtra.Item
                    title="Toggle Yabai"
                    onAction={() => {
                        if (yabaiEnabled) {
                            runYabaiCommand(YabaiCommands.Stop)
                        } else {
                            runYabaiCommand(YabaiCommands.Start)
                        }
                        setYabaiEnabled(!yabaiEnabled)
                    }}
                />
                <MenuBarExtra.Item title="Unseen" />
                <MenuBarExtra.Item
                    title=""
                    onAction={() => {
                        console.log("unseen pull request clicked");
                    }}
                />
            </MenuBarExtra.Section>
        </MenuBarExtra>
    );
}