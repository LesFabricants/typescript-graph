export function inverseGraph(graph: Record<string, any>) {
  const explore = (graph: Record<string, any>, parents: string[] = []) => {
    const paths = [parents];
    for (const key in graph) {
      paths.push(...explore(graph[key], [...parents, key]));
    }

    return paths;
  };

  const invertedGraph: any = {};

  for (const paths of explore(graph)) {
    if (paths.length === 0) continue;
    const reverse = paths.slice().reverse();
    const [first, ...rest] = reverse;
    invertedGraph[first] = rest;
  }

  return invertedGraph;
}
