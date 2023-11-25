import { FlatGraph } from "../types/graph";
import { TypedRecursiveGraph } from "../types/typedGraph";

export function inverseGraph(graph: TypedRecursiveGraph) {
  const explore = (graph: TypedRecursiveGraph, parents: string[] = []) => {
    const paths = [parents];
    for (const key in graph) {
      paths.push(...explore(graph[key], [...parents, key]));
    }

    return paths;
  };

  const invertedGraph: FlatGraph<string> = {};

  for (const paths of explore(graph)) {
    if (paths.length === 0) continue;
    const reverse = paths.slice().reverse();
    const [first, ...rest] = reverse;
    invertedGraph[first] = rest;
  }

  return invertedGraph;
}
