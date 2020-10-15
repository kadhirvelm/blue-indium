import express from "express";
import { join } from "path";

export function addComponentsCSS(app: express.Express) {
    app.get("/components.css", (_req, res) => {
        res.sendFile(join(process.cwd(), "../components/dist/components.css"));
    });
}
