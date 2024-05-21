import fs from "fs";
import packageJson from "./package.json" assert { type: "json" };

const createCjsPackageJson = () => {
  const packageJsonFileContent = () => {
    const result = packageJson;

    result.type = "commonjs";
    result.main = "index.js";
    result.types = "index.d.ts";

    delete result.scripts;
    delete result.mocha;

    return JSON.stringify(result);
  };

  const packageJsonFilePath = "./dist/package.json";

  if (!fs.existsSync(packageJsonFilePath)) {
    fs.writeFile(packageJsonFilePath, packageJsonFileContent(), (error) => {
      if (error) throw error;
    });
  }
};

createCjsPackageJson();
