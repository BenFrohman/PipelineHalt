#!/usr/bin/env node
import { run } from "./cli.js";
process.exitCode = await run(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
});
