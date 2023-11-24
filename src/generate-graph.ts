import * as ts from "typescript";

export function generateGraph(inputDir: string) {
  const configPath = ts.findConfigFile(inputDir, ts.sys.fileExists);
  if (!configPath) {
    throw new Error('Could not find a valid "tsconfig.json".');
  }
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);

  const splitedConfigPath = configPath.split("/");
  const rootDir = splitedConfigPath
    .slice(0, splitedConfigPath.length - 1)
    .join("/");
  const { options, fileNames } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    rootDir
  );
  options.rootDir = rootDir;

  const program = ts.createProgram(fileNames, options);
  const sources = program
    .getSourceFiles()
    .filter((node) => !node.fileName.includes("node_modules"))
    .map((node) => {
      const fileName = node.fileName;
      const dependencies: string[] = [];

      ts.forEachChild(node, (childNode) => {
        if (!ts.isImportDeclaration(childNode)) return;
        const module = childNode.moduleSpecifier.getText(node);
        const fullName = ts.resolveModuleName(
          module.substring(1, module.length - 1),
          node.fileName,
          options,
          ts.sys
        );
        if (
          fullName.resolvedModule?.isExternalLibraryImport ||
          !fullName.resolvedModule
        )
          return;

        dependencies.push(fullName.resolvedModule.resolvedFileName);
      });

      return {
        fileName,
        dependencies,
      };
    });

  return sources.reduce(
    (prev, cur) => ({ ...prev, [cur.fileName]: cur.dependencies }),
    {}
  );
}
