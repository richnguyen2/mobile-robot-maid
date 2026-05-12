import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchJson = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }
  return response.json()
}

const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  standby: 'bg-gray-100 text-gray-800',
}

const formatStatus = (status) => status.replace('_', ' ')

const RoomItem = ({ room, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(room)}
    className="w-72 rounded-3xl bg-blue-600 px-8 py-6 text-xl font-semibold text-white shadow-xl transition hover:bg-blue-700"
  >
    {room.name}
  </button>
)

const SidebarTask = ({ task, onCancel }) => (
  <div className="group relative rounded-2xl bg-slate-50 p-4 border border-slate-200 transition hover:bg-slate-100">
    <div className="pr-8">
      <p className="font-semibold text-slate-900">
        {task.status === 'completed' ? `${task.name}: Completed!` : task.name}
      </p>
      <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[task.status] || statusClasses.standby}`}>
        {formatStatus(task.status)}
      </span>
    </div>
    <button
      type="button"
      onClick={() => onCancel(task.id)}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-red-500 p-2 text-white opacity-0 transition group-hover:opacity-100"
      aria-label={`Move ${task.name} to standby`}
    >
      ✕
    </button>
  </div>
)

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [roomsError, setRoomsError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomTasks, setRoomTasks] = useState([])
  const [roomTasksLoading, setRoomTasksLoading] = useState(false)
  const [queueTasks, setQueueTasks] = useState([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [queuedTaskButtonId, setQueuedTaskButtonId] = useState(null)
  const queuedMessageTimeout = useRef(null)

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true)
    setRoomsError(null)

    try {
      const result = await fetchJson('/rooms')
      setRooms(result.data)
    } catch (error) {
      setRoomsError(error.message)
    } finally {
      setRoomsLoading(false)
    }
  }, [])

  const loadRoomTasks = useCallback(async (roomId) => {
    setRoomTasksLoading(true)

    try {
      const result = await fetchJson('/tasks')
      setRoomTasks(result.data.filter((task) => task.room_id === roomId))
    } catch (error) {
      console.error('Failed to load room tasks:', error)
      setRoomTasks([])
    } finally {
      setRoomTasksLoading(false)
    }
  }, [])

  const loadQueueTasks = useCallback(async () => {
    setQueueLoading(true)

    try {
      const result = await fetchJson('/tasks')
      const tasks = result.data
        .filter((task) => task.status !== 'standby')
        .sort((a, b) => new Date(a.dispatched_at) - new Date(b.dispatched_at))
      setQueueTasks(tasks)
    } catch (error) {
      console.error('Failed to load queue tasks:', error)
      setQueueTasks([])
    } finally {
      setQueueLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
    loadQueueTasks()
  }, [loadRooms, loadQueueTasks])

  useEffect(() => {
    if (!selectedRoom) {
      setRoomTasks([])
      return
    }

    loadRoomTasks(selectedRoom.id)
  }, [selectedRoom, loadRoomTasks])

  useEffect(() => {
    const interval = setInterval(loadQueueTasks, 5000)
    return () => clearInterval(interval)
  }, [loadQueueTasks])

  useEffect(() => {
    return () => clearQueuedButtonTimeout()
  }, [])

  const handleRoomClick = (room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const clearQueuedButtonTimeout = () => {
    if (queuedMessageTimeout.current) {
      clearTimeout(queuedMessageTimeout.current)
      queuedMessageTimeout.current = null
    }
  }

  const handleTaskDispatch = async (task) => {
    if (task.status !== 'standby') {
      clearQueuedButtonTimeout()
      setQueuedTaskButtonId(task.id)
      queuedMessageTimeout.current = setTimeout(() => {
        setQueuedTaskButtonId(null)
      }, 1000)
      return
    }

    try {
      await fetchJson(`/tasks/${task.id}/dispatch`, { method: 'PATCH' })
      setIsModalOpen(false)
      loadQueueTasks()
    } catch (error) {
      console.error('Failed to dispatch task:', error)
    }
  }

  const handleTaskStandby = async (taskId) => {
    try {
      await fetchJson(`/tasks/${taskId}/standby`, { method: 'PATCH' })
      setQueueTasks((current) => current.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error('Failed to mark task as standby:', error)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-10 text-center">Rooms</h1>

      {roomsLoading && <p className="text-center text-slate-600">Loading rooms...</p>}
      {roomsError && <p className="text-center text-red-600">{roomsError}</p>}

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-6">
        {rooms.map((room) => (
          <RoomItem key={room.id} room={room} onSelect={handleRoomClick} />
        ))}
      </div>

      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-6">
              <h2 className="text-3xl font-bold text-slate-900 text-center">Tasks</h2>
              <p className="text-sm text-slate-600 text-center mt-2">{selectedRoom.name}</p>
            </div>

            <div className="px-6 py-8">
              {roomTasksLoading && <p className="text-center text-slate-600">Loading tasks...</p>}
              {!roomTasksLoading && roomTasks.length === 0 && (
                <p className="text-center text-slate-600">No tasks for this room</p>
              )}
              <div className="flex flex-col gap-3">
                {roomTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleTaskDispatch(task)}
                    className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold transition hover:bg-blue-700"
                  >
                    {queuedTaskButtonId === task.id ? 'Already Queued' : task.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-3 text-slate-700 font-semibold transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsSidebarOpen((state) => !state)}
        className="fixed right-10 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-4 text-white shadow-lg transition hover:bg-blue-700 z-40"
        aria-label={isSidebarOpen ? 'Close task queue' : 'Open task queue'}
      >
        ☰
      </button>

      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-2xl font-bold text-slate-900">Task Queue</h3>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl text-slate-600 transition hover:text-slate-900"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto px-4 py-6" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {queueLoading && <p className="text-center text-slate-600">Refreshing queue...</p>}
          {!queueLoading && queueTasks.length === 0 && (
            <p className="text-center text-slate-600">No tasks in queue</p>
          )}
          {queueTasks.map((task) => (
            <SidebarTask key={task.id} task={task} onCancel={handleTaskStandby} />
          ))}
        </div>
      </aside>
    </div>
  )
}

export default Rooms
