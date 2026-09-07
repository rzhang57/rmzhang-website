import { createInterface } from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ENV_FILE = ".env.local";
const TARGETS = ["production", "preview", "development"];
const flags = new Set(process.argv.slice(2));

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

async function readPiped() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const lines = Buffer.concat(chunks).toString("utf8").split(/\r?\n/);
  return [lines[0] ?? "", lines[1] ?? lines[0] ?? ""];
}

async function prompt() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  let muted = false;
  rl._writeToOutput = (text) => {
    if (!muted) rl.output.write(text);
  };

  const ask = (question) =>
    new Promise((resolve) => {
      rl.question(question, (answer) => {
        muted = false;
        rl.output.write("\n");
        resolve(answer.trim());
      });
      muted = true;
    });

  const password = await ask("new admin password: ");
  const confirm = await ask("confirm: ");
  rl.close();
  return [password, confirm];
}

function hashPassword(password) {
  const N = 16384;
  const R = 8;
  const P = 1;
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64, { N, r: R, p: P });
  return [
    "scrypt",
    N,
    R,
    P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join(":");
}

function readLocalEnv() {
  if (!existsSync(ENV_FILE)) return {};
  return Object.fromEntries(
    readFileSync(ENV_FILE, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
      .map((line) => {
        const at = line.indexOf("=");
        return [line.slice(0, at).trim(), line.slice(at + 1)];
      })
  );
}

function upsertLocalEnv(values) {
  const lines = existsSync(ENV_FILE)
    ? readFileSync(ENV_FILE, "utf8").split(/\r?\n/)
    : [];
  for (const [name, value] of Object.entries(values)) {
    const index = lines.findIndex((line) => line.startsWith(`${name}=`));
    if (index === -1) lines.push(`${name}=${value}`);
    else lines[index] = `${name}=${value}`;
  }
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  writeFileSync(ENV_FILE, lines.join("\n") + "\n");
}

function vercel(args, input) {
  return execFileSync("vercel", args, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
}

function pushToVercel(values) {
  for (const [name, value] of Object.entries(values)) {
    for (const target of TARGETS) {
      try {
        vercel(["env", "rm", name, target, "--yes"]);
      } catch {
        // absent in this environment, nothing to replace
      }
      vercel(["env", "add", name, target], value);
      console.log(`  ${name} -> ${target}`);
    }
  }
}

const [password, confirm] = process.stdin.isTTY
  ? await prompt()
  : await readPiped();

if (password.length < 12) fail("use at least 12 characters.");
if (password !== confirm) fail("passwords did not match.");

const local = readLocalEnv();
const values = {
  ADMIN_PASSWORD_HASH: hashPassword(password),
  ADMIN_SECRET: local.ADMIN_SECRET || randomBytes(32).toString("hex"),
};

const writeEnv = flags.has("--env") || flags.has("--vercel");
const pushEnv = flags.has("--vercel");

if (writeEnv) {
  upsertLocalEnv(values);
  console.log(`\nwrote ADMIN_PASSWORD_HASH and ADMIN_SECRET to ${ENV_FILE}`);
}

if (pushEnv) {
  console.log("\npushing to vercel:");
  try {
    pushToVercel(values);
  } catch (error) {
    fail(
      `vercel rejected the write: ${error.stderr || error.message}\n` +
        "run `vercel login` and `vercel link` first."
    );
  }
}

if (!writeEnv) {
  console.log("\nset both in .env.local and in the vercel project:\n");
  console.log(`ADMIN_PASSWORD_HASH=${values.ADMIN_PASSWORD_HASH}`);
  console.log(`ADMIN_SECRET=${values.ADMIN_SECRET}`);
  console.log("\nor re-run with --env to write them, --vercel to also push.");
}

console.log("\nthe password itself is never stored anywhere.\n");
