import { existsSync, mkdirSync } from "fs-extra";

export function ensureDirectoryExists(directory: string) {
    if (existsSync(directory)) {
        return;
    }

    return mkdirSync(directory, { recursive: true });
}
