import { FlatGraph, MixedGraph, RecursiveGraph } from "./graph";
import { Node } from "./node";

type BaseType = Node;
export type TypedFlatGraph = FlatGraph<BaseType>;
export type TypedRecursiveGraph = RecursiveGraph<BaseType>;
export type TypedMixedGraph = MixedGraph<BaseType>;
