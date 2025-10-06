import networkx as nx

def build_graph(endpoints, connections):
    G = nx.DiGraph()
    for ep in endpoints:
        G.add_node(ep)
    for src, dst in connections:
        G.add_edge(src, dst)
    return G

def find_attack_paths(G, start, end):
    return list(nx.all_simple_paths(G, source=start, target=end))
