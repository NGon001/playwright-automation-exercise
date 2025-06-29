import fs from 'fs/promises';

async function emptyDir(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Ignore errors
  }
}

await emptyDir('test-resultsSave/screenshots');
await emptyDir('test-resultsSave/videos');