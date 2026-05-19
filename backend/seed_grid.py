# seed_grid.py
from sqlmodel import Session, create_engine, select
from app.models import Node, Edge, Robot, Task
from app.config import DATABASE_URL 

engine = create_engine(DATABASE_URL)

def seed_grid():
    print("🚀 Starting Grid Map Seeding Process...")
    
    with Session(engine) as session:
        
        print("🧹 Clearing out old database records...")
        session.query(Robot).delete()
        session.query(Task).delete()
        session.query(Edge).delete()
        session.query(Node).delete()
        session.commit()
        
        GRID_SIZE = 20
        nodes_matrix = {}
        
        wall_coordinates = set()
        for y in range(0, GRID_SIZE):
            if y != 10:  
                wall_coordinates.add((10, y))
                
        special_locations = {
            (2, 2): {"node_type": "location", "label": "Charging Dock"},
            (5, 15): {"node_type": "location", "label": "Kitchen"},
            (17, 8): {"node_type": "location", "label": "Living Room"}
        }

        print(f"Creating a {GRID_SIZE}x{GRID_SIZE} grid matrix ({GRID_SIZE * GRID_SIZE} cells)...")
        
        for x in range(GRID_SIZE):
            for y in range(GRID_SIZE):
                is_wall = (x, y) in wall_coordinates
                loc_meta = special_locations.get((x, y), {"node_type": "grid_cell", "label": None})
                
                node = Node(
                    x_coord=x,
                    y_coord=y,
                    node_type=loc_meta["node_type"] if not is_wall else "grid_cell",
                    label=loc_meta["label"] if not is_wall else None,
                    is_occupied=1.0 if is_wall else 0.0
                )
                
                session.add(node)
                nodes_matrix[(x, y)] = node
                
        session.commit() 
        print("Grid nodes flushed successfully.")

        print("Generating adjacent grid cell edges (Up/Down/Left/Right)...")
        edge_count = 0
        
        for x in range(GRID_SIZE):
            for y in range(GRID_SIZE):
                current_node = nodes_matrix[(x, y)]
                
                if current_node.is_occupied == 1.0:
                    continue
                    
                if x + 1 < GRID_SIZE:
                    right_node = nodes_matrix[(x + 1, y)]
                    if right_node.is_occupied < 1.0:
                        session.add(Edge(source=current_node.id, target=right_node.id))
                        session.add(Edge(source=right_node.id, target=current_node.id))
                        edge_count += 2
                        
                if y + 1 < GRID_SIZE:
                    down_node = nodes_matrix[(x, y + 1)]
                    if down_node.is_occupied < 1.0:
                        session.add(Edge(source=current_node.id, target=down_node.id))
                        session.add(Edge(source=down_node.id, target=current_node.id))
                        edge_count += 2
                        
        session.commit()
        print(f"Created {edge_count} directional edge layout pairings.")

        dock_node = session.exec(
            select(Node).where(Node.label == "Charging Dock")
        ).first()
        
        robot = Robot(
            name="Bot-01",
            status="idle",
            current_node_id=dock_node.id,
            current_task_id=None
        )
        session.add(robot)
        
        kitchen_node = session.exec(
            select(Node).where(Node.label == "Kitchen")
        ).first()
        
        sample_task = Task(
            name="Mop Kitchen Floor",
            status="standby",
            node_id=kitchen_node.id,
            dispatched_at=None
        )
        session.add(sample_task)
        
        session.commit()
        print("Robot instantiated safely at the Charging Dock location.")
        print("Standby Task created and assigned directly to the Kitchen node cell.")
        print("Database successfully seeded with full Grid Map environment matrix!")

if __name__ == "__main__":
    seed_grid()