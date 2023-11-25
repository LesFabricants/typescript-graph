import {
  TypedFlatGraph,
  TypedMixedGraph,
  TypedRecursiveGraph,
} from "../types/typedGraph";

export function buildCompleteGraph(graph: TypedFlatGraph): TypedRecursiveGraph {
  const newGraph: TypedMixedGraph = { ...graph };
  for (const key in graph) {
    newGraph[key] = graph[key].reduce(
      (prev, child) => ({
        ...prev,
        [child.key]: newGraph[child.key],
      }),
      {}
    );
  }

  const flatten = (graph: TypedRecursiveGraph) => {
    const childs: string[] = [];
    for (const key in graph) {
      childs.push(key);
      childs.push(...flatten(graph[key]));
    }
    return childs;
  };

  const childNodes = Object.values(newGraph as TypedRecursiveGraph)
    .map((graph) => flatten(graph))
    .flat();

  for (const node of childNodes) {
    delete newGraph[node];
  }

  return newGraph as TypedRecursiveGraph;
}
