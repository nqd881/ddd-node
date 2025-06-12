import fs from "fs";

const createCjsPackageJson = () => {
  const packageJsonContent = fs.readFileSync("./package.json", "utf-8");
  const packageJsonObj = JSON.parse(packageJsonContent);

  const packageJsonFileContent = () => {
    const result = packageJsonObj;

    result.type = "commonjs";
    result.main = "index.js";
    result.types = "index.d.ts";

    delete result.files;
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
