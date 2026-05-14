import { fetchJson } from './api.js'

export const getTasks = () => fetchJson('/tasks')
export const dispatchTask = (taskId) => fetchJson(`/tasks/${taskId}/dispatch`, { method: 'PATCH' })
export const standbyTask = (taskId) => fetchJson(`/tasks/${taskId}/standby`, { method: 'PATCH' })
