export const buildGraphPayload = (edges, n) => ({
    edges: edges.map((edge) => [edge.origin, edge.destination, edge.weight]),
    n: n,
});

export const fetchGraph = async (apiUrl, id, token) => {
    const auth = `Bearer ${token}`;
    const res = await fetch(`${apiUrl}/graphs/${id}`, {
        method: "GET",
        headers: {
            Authorization: auth,
        },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error("Erro ao fazer o parse da resposta como JSON: ", e);
        throw e;
    }

    return data;
};

export const fetchAdjacencyMatrix = async (apiUrl, edges, n) => {
    const graph = buildGraphPayload(edges, n);

    const res = await fetch(`${apiUrl}/graphs/matrix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graph),
    });
    const data = await res.json();
    return data;
};

export const fetchAdjacencyList = async (apiUrl, edges, n) => {
    const graph = buildGraphPayload(edges, n);

    const res = await fetch(`${apiUrl}/graphs/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graph),
    });
    const data = await res.json();
    return data;
};

export const fetchPath = async (
    apiUrl, 
    edges,
    n,
    source,
    destination,
    algorithm,
    method,
) => {
    const graph = buildGraphPayload(edges, n);

    graph.source = source;
    graph.destination = destination;

    const res = await fetch(`${apiUrl}/graphs/${algorithm}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graph),
    });
    const data = await res.json();
    return data;
};

export const fetchDOT = async (apiUrl, edges, n) => {
    const graph = buildGraphPayload(edges, n);

    const res = await fetch(`${apiUrl}/graphs/dot/matrix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graph),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;
};

export const updateGraph = async (apiUrl, nodes, edges, token, graph_id) => {
    const auth = `Bearer ${token}`;
    const res = await fetch(`${apiUrl}/graphs/update/${graph_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: auth,
        },
        body: JSON.stringify({
            vertices: nodes,
            edges: edges,
        }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;
};

export const createGraph = async (apiUrl, name, token) => {
    const auth = `Bearer ${token}`;
    const res = await fetch(`${apiUrl}/graphs/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: auth,
        },
        body: JSON.stringify({
            name: name,
        }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;
};