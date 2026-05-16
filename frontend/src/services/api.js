const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = {

  // Fetch the active sorted tasks
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
  }

};