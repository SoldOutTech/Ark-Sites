import fs from "fs";
import path from "path";

const distDir = "./dist";
const fileExtensions = [".js", ".mjs"];

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  const updated = content.replace(
    /((import|export)\s.*?from\s*['"])(\.{1,2}\/[^'"]+?)(\.tsx?|\.ts)?(['"])/gs,
    (_, prefix, __, importPath, ext, suffix) => {
      // Ignore absolute or package imports
      if (!importPath.startsWith(".")) return _;

      // Normalize extensions
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  fs.writeFileSync(filePath, updated);
}

function processDir(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fileExtensions.includes(path.extname(entry))) {
      fixImportsInFile(fullPath);
    }
  }
}

processDir(distDir);
console.log("✅ Postbuild import path rewrite complete");
