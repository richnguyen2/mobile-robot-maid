import heapq
import math
from sqlmodel import Session, select
from app.models import Node, Edge

def calculate_heuristic(node_a: Node, node_b: Node) -> float:
    """Calculates the Euclidean (straight-line) distance between two grid coordinates."""
    return math.sqrt((node_b.x_coord - node_a.x_coord) ** 2 + (node_b.y_coord - node_a.y_coord) ** 2)

def run_astar_grid(session: Session, start_id: int, target_id: int) -> list[int]:
    """
    Computes the shortest path across the uniform grid map using A*.
    Returns a ordered list of Node IDs from start to target destination.
    """
    
    nodes_lookup = {node.id: node for node in session.exec(select(Node)).all()}
    
    if start_id not in nodes_lookup or target_id not in nodes_lookup:
        return []

    
    edges = session.exec(select(Edge)).all()
    adjacency_graph = {}
    for edge in edges:
        if edge.source not in adjacency_graph:
            adjacency_graph[edge.source] = []
        adjacency_graph[edge.source].append(edge.target)

    start_heuristic = calculate_heuristic(nodes_lookup[start_id], nodes_lookup[target_id])
    priority_queue = [(start_heuristic, 0.0, start_id, [start_id])]
    
    visited_nodes = set()

    while priority_queue:
        f_cost, g_cost, current_id, current_path = heapq.heappop(priority_queue)

        if current_id in visited_nodes:
            continue
        visited_nodes.add(current_id)

        if current_id == target_id:
            return current_path

        neighbors = adjacency_graph.get(current_id, [])
        for neighbor_id in neighbors:
            if neighbor_id not in visited_nodes:
                new_g_cost = g_cost + 1.0
                h_cost = calculate_heuristic(nodes_lookup[neighbor_id], nodes_lookup[target_id])
                new_f_cost = new_g_cost + h_cost
                
                heapq.heappush(
                    priority_queue, 
                    (new_f_cost, new_g_cost, neighbor_id, current_path + [neighbor_id])
                )

    return []