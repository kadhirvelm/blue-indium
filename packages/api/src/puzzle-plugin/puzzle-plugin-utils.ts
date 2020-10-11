export function dynamicallyImportCSSForPuzzle(puzzleName: string) {
    const newLinkElement = document.createElement("link");

    newLinkElement.href = `http://127.0.0.1:3000/${puzzleName}.css`;
    newLinkElement.rel = "stylesheet";

    document.head.append(newLinkElement);
}
