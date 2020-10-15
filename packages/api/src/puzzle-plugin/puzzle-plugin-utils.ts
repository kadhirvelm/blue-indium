export function dynamicallyImportCSS(fileName: string) {
    const newLinkElement = document.createElement("link");

    newLinkElement.href = `http://127.0.0.1:3000/${fileName}.css`;
    newLinkElement.rel = "stylesheet";

    document.head.append(newLinkElement);
}
