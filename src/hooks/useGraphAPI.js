import * as graphAPI from "../api/graphAPI.js";

export function useGraphAPI(apiUrl) {
  return {
    fetchGraph: (id, token) => graphAPI.fetchGraph(apiUrl, id, token),
    fetchAdjacencyMatrix: (edges, n) =>
      graphAPI.fetchAdjacencyMatrix(apiUrl, edges, n),
    fetchAdjacencyList: (edges, n) =>
      graphAPI.fetchAdjacencyList(apiUrl, edges, n),
    fetchPath: (edges, n, source, dest, alg, method) =>
      graphAPI.fetchPath(apiUrl, edges, n, source, dest, alg, method),
    fetchDOT: (edges, n, token, graph_id) =>
      graphAPI.fetchDOT(apiUrl, edges, n, token, graph_id),
    updateGraph: (nodes, edges, token, graph_id) =>
      graphAPI.updateGraph(apiUrl, nodes, edges, token, graph_id),
    createGraph: (name, token) =>
      graphAPI.createGraph(apiUrl, name, token),
  };
}
