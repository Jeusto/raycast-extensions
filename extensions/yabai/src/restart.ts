import { YabaiCommands, runYabaiCommand } from "./lib/yabai";

export default async function main() {
  await runYabaiCommand(YabaiCommands.Restart);
}
