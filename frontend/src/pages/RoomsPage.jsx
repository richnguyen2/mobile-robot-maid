import { useState, useEffect, useCallback, useRef } from 'react'

import RoomItem from '../components/RoomItem.jsx'
import TaskModal from '../components/TaskModal.jsx'
import TaskQueueSidebar from '../components/TaskQueueSidebar.jsx'

import { getRooms } from '../services/roomService.js'
import { getTasks, dispatchTask, standbyTask } from '../services/taskService.js'

const RoomsPage = () => {
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
      const result = await getRooms()
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
      const result = await getTasks()
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
      const result = await getTasks()
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

  const clearQueuedButtonTimeout = () => {
    if (queuedMessageTimeout.current) {
      clearTimeout(queuedMessageTimeout.current)
      queuedMessageTimeout.current = null
    }
  }

  useEffect(() => {
    const interval = setInterval(loadQueueTasks, 1000)
    return () => clearInterval(interval)
  }, [loadQueueTasks])

  useEffect(() => {
    return () => clearQueuedButtonTimeout()
  }, [])

  const handleRoomClick = (room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
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
      await dispatchTask(task.id)
      setIsModalOpen(false)
      loadQueueTasks()
    } catch (error) {
      console.error('Failed to dispatch task:', error)
    }
  }

  const handleTaskStandby = async (taskId) => {
    try {
      await standbyTask(taskId)
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
        <TaskModal
          selectedRoom={selectedRoom}
          roomTasks={roomTasks}
          roomTasksLoading={roomTasksLoading}
          queuedTaskButtonId={queuedTaskButtonId}
          onDispatch={handleTaskDispatch}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setIsSidebarOpen((state) => !state)}
        className="fixed right-10 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-4 text-white shadow-lg transition hover:bg-blue-700 z-40"
        aria-label={isSidebarOpen ? 'Close task queue' : 'Open task queue'}
      >
        ☰
      </button>

      <TaskQueueSidebar
        isOpen={isSidebarOpen}
        queueLoading={queueLoading}
        queueTasks={queueTasks}
        onClose={() => setIsSidebarOpen(false)}
        onCancel={handleTaskStandby}
      />
    </div>
  )
}

export default RoomsPage
