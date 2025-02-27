import { exec } from "child_process";
import open from "open";

export const promisify =
  (func: Function) =>
  (...args: any[]) =>
    new Promise((resolve, reject) => func(...args, (err: Error, result: any) => (err ? reject(err) : resolve(result))));

const execAsync = promisify(exec);

export async function checkIfInstalled(command: string): Promise<boolean> {
  // try {
  //   // await execAsync(`${command} --help`);
  //   await execAsync(`/opt/homebrew/bin/single-file --help`);
  //   return true;
  // } catch (error) {
  //   return false;
  // }
  try {
    await open("", { app: { name: "single-file", arguments: ["https://example.com"] } });
  } catch (error) {
    console.warn(error);
  }
}
