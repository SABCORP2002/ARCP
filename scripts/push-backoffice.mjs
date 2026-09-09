// Mirror the cms/ folder to the standalone back-office repository so it can be
// deployed on its own (e.g. Vercel). Run after pushing the main repo:
//   npm run push:backoffice          -> pushes cms/ to ARCP-Backoffice main
//   npm run push:backoffice -- dev   -> pushes to another branch
import { spawnSync } from "node:child_process";

const REMOTE = "https://github.com/SABCORP2002/ARCP-Backoffice.git";
const branch = process.argv[2] || "main";

console.log(`Splitting cms/ and pushing to ${REMOTE} (${branch})…`);
const result = spawnSync("git", ["subtree", "push", "--prefix", "cms", REMOTE, branch], {
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
