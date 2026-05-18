import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background } from '@xyflow/react';
import { useState } from 'react';
import WaypointNode from '../components/WaypointNode';
import LocationNode from '../components/LocationNode';
import CreateTaskModal from '../components/CreateTaskModal';
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
    const [expandedNodeId, setExpandedNodeId] = useState(null);
    const [activeCreateTaskModalId, setActiveCreateTaskModalId] = useState(null);

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

        select: (rawNodes) => rawNodes.map(node => {
            const isExpanded = expandedNodeId === node.id.toString();
            return {
                id: node.id.toString(),
                type: node.node_type,
                position: { x: node.x_coord, y: node.y_coord },
                zIndex: isExpanded ? 1000 : 1,
                data: {
                    label: node.label ?? "",
                    expandedNodeId,
                    setExpandedNodeId,
                    openTaskModal: (nodeId) => setActiveCreateTaskModalId(nodeId)
                },
                draggable: false
        }})
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
                            onPaneClick={() => {
                                setExpandedNodeId(null);
                            }}
                            fitView
                        >
                            <Background />
                        </ReactFlow>
                        {activeCreateTaskModalId && (
                            <div className="fixed inset-0 backdrop-blur-xs z-[9999] flex items-center justify-center">
                                <CreateTaskModal
                                    activeCreateTaskModalId={activeCreateTaskModalId}
                                    setActiveCreateTaskModalId={setActiveCreateTaskModalId}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="absolute top-4 right-4 z-10 p-4 border border-2 rounded-xl bg-white">
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
