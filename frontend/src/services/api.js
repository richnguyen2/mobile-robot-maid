const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = {

  // NODES API REQUESTS

  getNodes: async () => {
    const res = await fetch(`${API_BASE_URL}/nodes`);
    if (!res.ok) throw new Error('Failed to load nodes');
    const json = await res.json();
    return json.data;
  },

  getLocations: async () => {
    const res = await fetch(`${API_BASE_URL}/nodes/locations`);
    if (!res.ok) throw new Error('Failed to load locations');
    const json = await res.json();
    return json.data;
  },

  getOccupants: async () => {
    const res = await fetch(`${API_BASE_URL}/nodes/occupants`);
    if (!res.ok) throw new Error('Failed to load occupants');
    const json = await res.json();
    return json.data;
  },

  getNodeById: async (nodeId) => {
    const res = await fetch(`${API_BASE_URL}/nodes/${nodeId}`);
    if (!res.ok) throw new Error('Failed to load node');
    const json = await res.json();
    return json.data;
  },

  updateNode: async (nodeId, updateData) => {
    const res = await fetch(`${API_BASE_URL}/nodes/${nodeId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update node');
    return await res.json();
  },

  // TASKS API REQUESTS

  getActiveTasks: async () => {
    const res = await fetch(`${API_BASE_URL}/tasks/active`);
    if (!res.ok) throw new Error('Failed to load active tasks');
    const json = await res.json();
    return json.data;
  },

  standbyTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/standby`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to put task on standby');
    return await res.json();
  },

  getTaskByNode: async (nodeId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/node/${nodeId}`);
    if (!res.ok) throw new Error('Failed to load task for node');
    const json = await res.json();
    return json.data;
  },

  dispatchTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/dispatch`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to dispatch task');
    return await res.json();
  },

  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  },

  completeTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to complete task');
    return await res.json();
  },

  deleteTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return await res.json();
  },

  // ROBOT API REQUESTS

  getRobotPath: async () => {
    const res = await fetch(`${API_BASE_URL}/robot/path`);
    if (!res.ok) throw new Error('Failed to load robot path');
    const json = await res.json();
    return json.data;
  },

  getNextTask: async () => {
    const res = await fetch(`${API_BASE_URL}/robot/next-task`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to get next task');
    const json = await res.json();
    return json.data;
  },

  updateRobot: async (updateData) => {
    const res = await fetch(`${API_BASE_URL}/robot/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update robot');
    return await res.json();
  },

  getRobotNode: async () => {
    const res = await fetch(`${API_BASE_URL}/robot/node`);
    if (!res.ok) throw new Error('Failed to load robot node');
    const json = await res.json();
    return json.data;
  }

};