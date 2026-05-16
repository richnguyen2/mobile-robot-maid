import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { useState, useCallback } from 'react';
import WaypointNode from '../components/WaypointNode';
import LocationNode from '../components/LocationNode';
import TaskList from '../components/TaskList';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

const nodeTypes = {
  waypoint: WaypointNode,
  room: LocationNode,
};

const initialNodes = [
  { id: 'n1', type: 'waypoint', position: { x: 0, y: 0 }, data: { label: 'Node 1' } , draggable: false},
  { id: 'n2', type: 'waypoint', position: { x: 50, y: 50 }, data: { label: 'Node 2' } , draggable: false},
  { id: 'n3', type: 'room', position: { x: 0, y: 100 }, data: { label: 'Node 3' } , draggable: false},
  { id: 'n4', type: 'waypoint', position: { x: 77, y: 40 }, data: { label: 'Node 4' } , draggable: false}
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }, { id: 'n2-n3', source: 'n2', target: 'n3' }];
 
const MapPage = () => {
    const queryClient = useQueryClient();

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const { 
        data: tasks = [], 
        isLoading: isTasksLoading 
    } = useQuery({
        queryKey: ['tasks', 'active'],
        queryFn: api.getActiveTasks,
        refetchInterval: 5000,
    });

    const standbyMutation = useMutation({
    mutationFn: (taskId) => api.standbyTask(taskId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] });
    },
    
    onError: (error) => {
      console.error("Standby failed:", error.message);
      alert(`Could not update task status: ${error.message}`);
    }
  });

    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    nodesConnectable={false}
                    fitView
                />
            </div>
            <div className="absolute top-4 right-4 z-10 p-4 border rounded-lg">
                {isTasksLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <TaskList
                        tasks={tasks}
                        onCancel={standbyMutation.mutate}
                    />
                )}
            </div>
        </div>
    );
}

export default MapPage
