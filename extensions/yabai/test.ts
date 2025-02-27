import { exec } from "child_process";

exec("yabai --start-service", (error, stdout, stderr) => {
  if (error) {
    console.warn(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.warn(`stderr: ${stderr}`);
    return;
  }
  console.warn(`stdout: ${stdout}`);
});
