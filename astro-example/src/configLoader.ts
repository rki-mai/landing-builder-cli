import { validateConfig } from './configSchema';
import rawConfig from "../site.config.json";

export const config = validateConfig(rawConfig);
