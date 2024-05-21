import fs from "fs";
import path from "path";
import packageJson from "./package.json" assert { type: "json" };

const buildDir = "./dist";

packageJson.type = "commonjs";
packageJson.main = "index.js";
packageJson.types = "index.d.ts";

const createCjsPackageJson = () => {
  const packageJsonFilePath = "./dist/package.json";

  if (!fs.existsSync(packageJsonFilePath)) {
    fs.writeFile(packageJsonFilePath, JSON.stringify(packageJson), (error) => {
      if (error) throw error;
    });
  }
};

createCjsPackageJson();
