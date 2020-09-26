import * as path from "path";
import * as webpack from "webpack";

export function getTypingsFilePath(this: webpack.loader.LoaderContext) {
    const srcPath = this.resourcePath.match(/.*\/packages\/[\w]*\//g);
    if (srcPath == null || srcPath?.length === 0) {
        throw new Error("Could not identify where the src path is.");
    }

    const sourcePath = path.dirname(this.resourcePath).match(/\/src.*/g)?.[0]

    const removeSrcFromPath = (filePath: string | undefined) => filePath === undefined ? "" : filePath.split("/").slice(2).join("/");

    return { path: path.join(srcPath[0], "compiled_types", removeSrcFromPath(sourcePath) ?? ""), sourcePath, file: path.basename(this.resourcePath) };
}