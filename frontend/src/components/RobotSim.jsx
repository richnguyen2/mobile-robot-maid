import React, { useState, useEffect } from "react";
import { api } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const RobotSim = ({ pathData, currentTask, refetchTasks, updatePosition }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const queryClient = useQueryClient();
    const completeTaskMutation = useMutation({
        mutationFn: (taskId) => api.completeTask(taskId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] });
            queryClient.invalidateQueries({ queryKey: ['robot', 'path'] });
            queryClient.invalidateQueries({ queryKey: ['robot', 'node'] });
        },

        onError: (error) => {
            console.error("Failed to complete task:", error.message);
            alert(`Could not complete task: ${error.message}`);
        }
    });

    useEffect(() => {
        setStepIndex(0);
    }, [currentTask]);

    const handleStep = async () => {
        if (!currentTask) {
            await api.getNextTask(); 
            refetchTasks();
            return;
        }

        if (pathData?.nodes && stepIndex < pathData.nodes.length - 1) {
            const nextNode = pathData.nodes[stepIndex + 1];
            await updatePosition({ current_node_id: nextNode.id });
            setStepIndex(prev => prev + 1);
        } 
        
        else if (pathData?.nodes && stepIndex === pathData.nodes.length - 1) {
            completeTaskMutation.mutate(currentTask.id);
            setStepIndex(0);
            refetchTasks();
        }
    };

    return (
        <div className="w-48 p-4 border rounded-lg border-2">
            <h1 className="text-xl font-bold mb-4 text-center">Robot Simulation</h1>
            <button
                type="button"
                onClick={handleStep}
                className="w-full p-4 rounded-lg border border-black hover:bg-black hover:text-white transition-colors"
            >
                {currentTask ? `Step (${stepIndex + 1}/${pathData?.nodes?.length || 0})` : "Fetch Next Task"}
            </button>
        </div>
    );
};

export default RobotSim;