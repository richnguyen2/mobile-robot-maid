const TaskModal = ({
  selectedRoom,
  roomTasks,
  roomTasksLoading,
  queuedTaskButtonId,
  onDispatch,
  onClose,
}) => (
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
              onClick={() => onDispatch(task)}
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
          onClick={onClose}
          className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-3 text-slate-700 font-semibold transition hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)

export default TaskModal
