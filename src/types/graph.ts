export interface RecursiveGraph<T> {
  [key: string]: RecursiveGraph<T>;
}

export interface FlatGraph<T> {
  [key: string]: T[];
}

export interface MixedGraph<T> {
  [key: string]: T[] | RecursiveGraph<T>;
}
