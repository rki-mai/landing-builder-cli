import fs from "node:fs";
import path from "node:path";
import { validateConfig } from './configSchema';

const rawConfigPath = process.env.CONFIG_PATH;
if (!rawConfigPath) {
    throw new Error("Path to configuration file not specified");
}

const configPath = path.resolve(rawConfigPath);
const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"))

export const config = validateConfig(rawConfig);
