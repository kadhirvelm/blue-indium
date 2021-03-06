import { ORIGIN, PORT } from "@blue-indium/api";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import { addComponentsCSS } from "./routes/componentsCSS";
import { instantiateRoomsForAllPuzzles } from "./routes/instantiateRoomsForAllPuzzles";
import { addPuzzleCSS } from "./routes/puzzleCSS";
import { configureSecurity } from "./security/configureSecurity";

const app = express();
const server = createServer(app);

app.use(compression());

configureSecurity(app);
addPuzzleCSS(app);
addComponentsCSS(app);

instantiateRoomsForAllPuzzles(server);

server.listen(PORT, ORIGIN, () => {
    // eslint-disable-next-line no-console
    console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
