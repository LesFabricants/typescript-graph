import { resolve } from "path";
import { buildCompleteGraph } from "./methods/build-complete-graph";
import generateGraph from "./methods/generate-graph";
import { inverseGraph } from "./methods/inverse-graph";
import { FlatGraph } from "./types/graph";
import { TypedFlatGraph, TypedRecursiveGraph } from "./types/typedGraph";

export class TypescriptDepencyGraph {
  public readonly sourcePath: string;
  private baseGraph!: TypedFlatGraph;

  private depencyGraph!: TypedRecursiveGraph;
  private invertedDepencyGraph!: FlatGraph<string>;
  constructor(sourcePath: string) {
    this.sourcePath = resolve(sourcePath);
    this.refresh();
  }

  refresh() {
    this.baseGraph = generateGraph(this.sourcePath);
    this.depencyGraph = buildCompleteGraph(this.baseGraph);
    this.invertedDepencyGraph = inverseGraph(this.depencyGraph);
  }

  getParentFiles(child: string) {
    return this.invertedDepencyGraph[child];
  }

  getDepencies(parent: string) {
    let deps = new Set(this.baseGraph[parent]);
    for (const dep of deps) {
      const childDep = this.getDepencies(dep.key);
      childDep.forEach((child) => deps.add(child));
    }
    return [...deps];
  }

  getExternalDepencies(parent: string) {
    const dependcySet = this.getDepencies(parent);
    return dependcySet.filter((dep) => dep.type === "dependency");
  }

  getInternalDepencies(parent: string) {
    const dependcySet = this.getDepencies(parent);
    return dependcySet.filter((dep) => dep.type === "internal");
  }
}
