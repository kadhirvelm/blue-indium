import { ORIGIN, PORT } from "../constants";

export function dynamicallyImportCSS(fileName: string) {
    const newLinkElement = document.createElement("link");

    newLinkElement.href = `http://${ORIGIN}:${PORT}/${fileName}.css`;
    newLinkElement.rel = "stylesheet";

    document.head.append(newLinkElement);
}
