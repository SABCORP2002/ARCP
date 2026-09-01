import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const childEnvironment = {
  ...process.env,
  npm_config_cache: process.env.npm_config_cache || path.join(os.tmpdir(), "arcp-deploy-npm-cache"),
};

function run(command, args, cwd = root, retries = 0) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const result = spawnSync(command, args, { cwd, env: childEnvironment, stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status === 0) return;
    if (attempt < retries) {
      console.warn(`Command interrupted; retrying installation (${attempt + 2}/${retries + 1})...`);
      continue;
    }
    process.exit(result.status || 1);
  }
}

function runNpm(args, cwd = root, retries = 0) {
  if (process.platform === "win32") {
    run(process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", `npm.cmd ${args.join(" ")}`], cwd, retries);
    return;
  }
  run("npm", args, cwd, retries);
}

run(process.execPath, [path.join(root, "scripts", "deployment-preflight.mjs")]);
runNpm(["ci", "--no-audit", "--no-fund"], root, 2);
runNpm(["ci", "--no-audit", "--no-fund"], path.join(root, "cms"), 2);
runNpm(["run", "migrate"], path.join(root, "cms"));
runNpm(["run", "seed"], path.join(root, "cms"));
runNpm(["run", "build"], path.join(root, "cms"));
runNpm(["run", "build"]);

console.log("Both ARCP applications are built and ready to start.");
