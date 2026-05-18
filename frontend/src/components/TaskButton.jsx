import { api } from '../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TaskButton = ({ task, onDispatch, onDelete, isDeleteMode }) => {
    return (
        <button
            type="button"
            onClick={() => {
                if (isDeleteMode) {
                    onDelete(task.id);
                } else {
                    onDispatch(task.id);
                }
            }}
            className="w-full mt-1 p-1 rounded-lg border border-black transition-colors hover:bg-black hover:text-white"
        >
            {task.name}
        </button>
)}

export default TaskButton