const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  standby: 'bg-gray-100 text-gray-800',
}

const formatStatus = (status) => status.replace('_', ' ')

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

export default SidebarTask
