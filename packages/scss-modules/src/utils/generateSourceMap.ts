import sourceMap from "source-map";
import path from "path";

export function generateSourceMap(rawInputString: string, exportLocalsObject: { [key: string]: string }, sourcePath: string | undefined, file: string) {
    const rawSourceMap = rawInputString.match(/\{\"version\".*\}/g);

    if (rawSourceMap == null || rawSourceMap.length === 0) {
        throw new Error("Could not find raw source map from css-loader. Please ensure css-loader is generating source-maps.");
    }

    const generatedContentSplitByNewLine = rawInputString.match(/\[module.id\, \"[^\"]*\"/g)?.[0].match(/\".*\"/g)?.[0].split("\\n");
    if (generatedContentSplitByNewLine == null || generatedContentSplitByNewLine.length === 0) {
        throw new Error("Could not identify generated content from css modules.");
    }

    const originalSourceMap = new sourceMap.SourceMapConsumer(JSON.parse(rawSourceMap[0]));
    const newSourceMap = new sourceMap.SourceMapGenerator({ file: `${file}.d.ts` });

    const getGeneratedLine = (exportLocalLine: number) => (exportLocalLine * 2) + 3;

    const getOutOfDirectory = sourcePath?.split("/").slice(1).map(() => "..") ?? [];
    const finalFilePath = path.join(...getOutOfDirectory, sourcePath ?? "", file);

    let alreadyCompletedLine = 0;
    Object.values(exportLocalsObject).forEach((value, exportLocalLine) => {
        generatedContentSplitByNewLine.slice(alreadyCompletedLine).forEach((content, line) => {
            if (content.match(value) == null) {
                return;
            }

            const originalLine = originalSourceMap.originalPositionFor({ line: alreadyCompletedLine + line + 1, column: 0 });
            const generatedLine = getGeneratedLine(exportLocalLine);

            newSourceMap.addMapping({ generated: { line: generatedLine, column: 1 }, original: { line: originalLine.line, column: originalLine.column }, source: finalFilePath, name: value });

            alreadyCompletedLine = line + 1;
        });
    });

    return newSourceMap;
}
