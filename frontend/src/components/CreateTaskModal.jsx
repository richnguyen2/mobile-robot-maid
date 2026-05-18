import { api } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const createTaskModal = ({ activeCreateTaskModalId, setActiveCreateTaskModalId }) => {
    const [taskName, setTaskName] = useState("");

    const queryClient = useQueryClient();
    const {
        data: node,
        isLoading: isNodeLoading,
    } = useQuery({
        queryKey: ['nodes', activeCreateTaskModalId],
        queryFn: () => api.getNodeById(activeCreateTaskModalId),
    });

    const createTaskMutation = useMutation({
        mutationFn: ({ taskData }) => api.createTask(taskData),

        onSuccess: (data, variables) => {
            const targetNodeId = Number(variables.nodeId);

            queryClient.invalidateQueries({ 
                queryKey: ['tasks', 'node', targetNodeId] 
            });
        },

        onError: (error) => {
            console.error("Task creation failed:", error.message);
            alert(`Could not create task: ${error.message}`);
        }
    });

    return (
        <div className="flex flex-col h-80 w-80 rounded-xl border border-black border-2 bg-white items-center">
            {isNodeLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="p-8 space-between flex flex-col h-full">
                    <h1 className="text-xl font-bold text-center mb-10">
                        Create Task For {node.label}
                    </h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createTaskMutation.mutate({
                                nodeId: activeCreateTaskModalId,
                                taskData: {
                                    name: taskName,
                                    node_id: activeCreateTaskModalId,
                                }
                            });
                            setActiveCreateTaskModalId(null);
                        }}
                        className="flex flex-col h-full justify-between">
                        <div>
                            Task Name:
                            <input
                                type="text"
                                className="border border-black rounded-xl border-2 px-2 py-1 w-full mt-2 mb-4"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="cancel"
                                onClick={() => setActiveCreateTaskModalId(null)}
                                className="border border-black rounded-xl border-2 px-4 py-2 transition-colors hover:bg-black hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="border border-black rounded-xl border-2 px-4 py-2 transition-colors hover:bg-black hover:text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default createTaskModal;