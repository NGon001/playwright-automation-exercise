import { getEnv } from "./Tools";
const { execSync } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

const host = await getEnv("TRCLI_HOST");
const user = await getEnv("TRCLI_USER");
const key = await getEnv("TRCLI_KEY");

if (!host || !user || !key) {
  console.error('Missing TRCLI_* environment variables');
  process.exit(1);
}

const cmd = `trcli -y -h "${host}" --project "Automationexercise" -u "${user}" -k "${key}" parse_junit --case-matcher "name" --title "Local run and import ${new Date().toISOString()}" --run-description "Manual local test run" -f ./test-results/junit-report.xml --close-run`;

execSync(cmd, { stdio: 'inherit' });