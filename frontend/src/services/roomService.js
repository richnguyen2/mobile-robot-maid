import { fetchJson } from './api.js'

export const getRooms = () => fetchJson('/rooms')