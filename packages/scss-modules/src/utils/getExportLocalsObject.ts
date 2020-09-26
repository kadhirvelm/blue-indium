export function getExportLocalsObject(src: string): string {
    const fullExportLocals = src.match(/exports\.locals\s=\s\{[\w\W\s\S]*\}\;/g);
    if (fullExportLocals == null || fullExportLocals?.length === 0) {
        throw new Error("Could not identify a exports local from the processed scss modules file.")
    }

    const exportObject = fullExportLocals[0].match(/\{[\w\W\s\S]*\}/);
    if (exportObject == null || exportObject?.length === 0) {
        throw new Error("Could not identify a complete object from the export locals string.")
    }

    return exportObject[0];
}
