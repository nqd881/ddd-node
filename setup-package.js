import fs from "fs";
import path from "path";
import packageJson from "./package.json" assert { type: "json" };

const buildDir = "./dist";

// console.log(packageJson);
packageJson.type = "commonjs";
packageJson.main = "index.js";
packageJson.types = "index.d.ts";

console.log(packageJson);

const createCjsPackageJson = () => {
  const packageJsonFilePath = "./dist/package.json";

  if (!fs.existsSync(packageJsonFilePath)) {
    fs.writeFile(packageJsonFilePath, JSON.stringify(packageJson), (error) => {
      if (error) throw error;
    });
    // let packJson;

    // fs.readFileSync("./package.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   packJson = JSON.parse(data);
    //   console.log(packJson);
    // });
  }
};

createCjsPackageJson();
