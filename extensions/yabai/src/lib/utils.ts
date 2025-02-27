import { exec } from "child_process";

export const promisify =
  (func: Function) =>
  (...args: any[]) =>
    new Promise((resolve, reject) => func(...args, (err: Error, result: any) => (err ? reject(err) : resolve(result))));

export const run = promisify(exec);
