type BaseNode<T extends object> = Record<string, T>;

export function buildCompleteGraph(graph: Record<string, string[]>) {
  const newGraph: any = { ...graph };
  for (const key in graph) {
    newGraph[key] = graph[key].reduce(
      (prev, child) => ({
        ...prev,
        [child]: newGraph[child],
      }),
      {}
    );
  }

  const flatten = (graph: any) => {
    const childs: string[] = [];
    for (const key in graph) {
      childs.push(key);
      childs.push(...flatten(graph[key]));
    }
    return childs;
  };

  const childNodes = Object.values(newGraph)
    .map((graph) => flatten(graph))
    .flat();

  for (const node of childNodes) {
    delete newGraph[node];
  }

  return newGraph;
}
