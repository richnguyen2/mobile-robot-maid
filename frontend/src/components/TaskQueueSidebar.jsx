import SidebarTask from './SidebarTask.jsx'

const TaskQueueSidebar = ({ isOpen, queueLoading, queueTasks, onClose, onCancel }) => (
  <aside
    className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
  >
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <h3 className="text-2xl font-bold text-slate-900">Task Queue</h3>
      <button
        type="button"
        onClick={onClose}
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
        <SidebarTask key={task.id} task={task} onCancel={onCancel} />
      ))}
    </div>
  </aside>
)

export default TaskQueueSidebar
