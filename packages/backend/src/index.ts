import { ORIGIN, PORT } from "@blue-indium/api";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import { instantiatePuzzles } from "./routes/instantiatePuzzles";
import { addPuzzleCSS } from "./routes/puzzleCSS";
import { configurePuzzleService } from "./routes/puzzleService";
import { configureSecurity } from "./security/configureSecurity";

const app = express();
const server = createServer(app);

app.use(compression());
configureSecurity(app);

addPuzzleCSS(app);
configurePuzzleService(app);
instantiatePuzzles(server);

server.listen(PORT, ORIGIN, () => {
    // eslint-disable-next-line no-console
    console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
