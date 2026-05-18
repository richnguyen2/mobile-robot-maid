import { Handle, Position } from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import TaskButton from './TaskButton';
import { useState } from 'react';

const LocationNode = ({ id, data }) => {
  const queryClient = useQueryClient();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const { label, expandedNodeId, setExpandedNodeId, openTaskModal } = data;

  const isExpanded = expandedNodeId === id;
  const id_int = parseInt(id, 10);
  const {
    data: tasksByNode = [],
    isLoading: isTasksLoading
  } = useQuery({
    queryKey: ['tasks', 'node', id_int],
    queryFn: () => api.getTaskByNode(id_int),
  });

  const dispatchTaskMutation = useMutation({
    mutationFn: (taskId) => api.dispatchTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] });
    },

    onError: (error) => {
      console.error("Dispatch failed:", error.message);
      alert(`Could not update task status: ${error.message}`);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => api.deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'node', id_int] });
    },

    onError: (error) => {
      console.error("Delete failed:", error.message);
      alert(`Could not delete task: ${error.message}`);
    }
  });

  return (
    <div className="group">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setExpandedNodeId(id)}
          className="max-w-16 p-1 text-wrap text-[8px] rounded-lg border border-black transition-transform group-hover:scale-110 justify-center"
        >
          {data.label}
        </button>
      ) : (
        <div className="flex bg-white flex-col text-[8px] items-center max-w-24 p-1 text-wrap rounded-lg border border-black transition-transform group-hover:scale-110">
          <div className="mb-1">
            {data.label}
          </div>
          {tasksByNode.length > 0 ? tasksByNode.map((task) => (
            <TaskButton key={task.id} task={task} onDispatch={dispatchTaskMutation.mutate} onDelete={deleteTaskMutation.mutate} isDeleteMode={deleteMode} />
          )) : <p className="text-center">No task available</p>}
          <button
            type="button"
            onClick={() => setDeleteMode(!deleteMode)}
            className={`w-full mt-1 rounded-lg border border-black transition-colors 
            ${deleteMode ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-white hover:bg-black text-black hover:text-white'}`}>
            -
          </button>
          <button
            type="button"
            onClick={() => openTaskModal(id_int)}
            className="w-full mt-1 rounded-lg border border-black transition-colors hover:bg-black hover:text-white">
            +
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default LocationNode;