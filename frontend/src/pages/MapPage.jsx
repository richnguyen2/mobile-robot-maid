import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background } from '@xyflow/react';
import { useState, useCallback } from 'react';
import WaypointNode from '../components/WaypointNode';
import LocationNode from '../components/LocationNode';
import TaskList from '../components/TaskList';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

const nodeTypes = {
    waypoint: WaypointNode,
    location: LocationNode,
};

const MapPage = () => {
    const queryClient = useQueryClient();

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

    const {
        data: nodes = [],
        isLoading: isNodesLoading
    } = useQuery({
        queryKey: ['nodes'],
        queryFn: api.getNodes,

        select: (rawNodes) => rawNodes.map(node => ({
            id: node.id.toString(),
            type: node.node_type,
            position: { x: node.x_coord, y: node.y_coord },
            data: { label: node.label ?? "" },
            draggable: false
        }))
    });

    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                {isNodesLoading ? (
                    <p>Loading map...</p>
                ) : (
                    <>
                        <ReactFlow
                            nodes={nodes}
                            nodeTypes={nodeTypes}
                            nodesConnectable={false}
                            fitView
                        >
                        <Background />
                        </ReactFlow>
                    </>
                )}
            </div>
            <div className="absolute top-4 right-4 z-10 p-4 border rounded-lg bg-white">
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
