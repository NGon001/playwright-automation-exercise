
const { execSync } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.TRCLI_HOST;
const user = process.env.TRCLI_USER;
const key = process.env.TRCLI_KEY;

if (!host || !user || !key) {
  console.error('Missing TRCLI_* environment variables');
  process.exit(1);
}

const now = new Date();
const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');

const cmd = `trcli -y -h "${host}" --project "Automationexercise" -u "${user}" -k "${key}" parse_junit --case-matcher "name" --title "Local run and import ${timestamp}" --run-description "Manual local test run" -f ./test-results/junit-report.xml --close-run`;

execSync(cmd, { stdio: 'inherit' });