import { createNodeMiddleware, createProbot } from "probot";
import app from "../../src/index.js";

export default createNodeMiddleware(app, { probot: createProbot() });
