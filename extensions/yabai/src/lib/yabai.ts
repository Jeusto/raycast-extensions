import { showFailureToast } from "@raycast/utils";
import { run } from "./utils";
import { Environment } from "@raycast/api";

export enum YabaiCommands {
  Start = "--start-service",
  Stop = "--stop-service",
  Restart = "--restart-service",
  ToggleFloat = "-m window --toggle float --grid 4:4:1:1:2:2",
  MaximizeWindow = "-m window --toggle zoom-fullscreen",
  BalanceWindows = "-m space --balance",
  ChangeLayout = "-m space --layout",
}

const yabaiPath = "/opt/homebrew/bin/yabai";

export async function runYabaiCommand(command: YabaiCommands) {
  try {
    await run(`${yabaiPath} ${command}`);
  } catch (error) {
    console.error(error);
    showFailureToast(`Failed to run yabai command: ${command}`);
  }
}
