import { register } from "node:module";
import { pathToFileURL } from "node:url";

// const { register } = require("node:module");
// const { pathToFileURL } = require("node:url");

register("ts-node/esm", pathToFileURL("./"));
