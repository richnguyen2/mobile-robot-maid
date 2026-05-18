const formatStatus = (status) => status.replace('_', ' ')

const ActiveTaskDisplay = ({ task, onCancel }) => (
  <div className="rounded-2xl p-2 mb-4 border text-sm transition items-center place-content-center justify-between group">
    <div className="flex items-center justify-between truncate">
      <p className="pr-2">
        {task.name}
      </p>
      <span className={`px-3 py-2 mr-12 truncate rounded-full font-semibold border border-black || statusClasses.standby}`}>
        {formatStatus(task.status)}
      </span>
      <button
        type="button"
        onClick={() => onCancel(task.id)}
        className="absolute right-6 rounded-full border border-black py-2 px-4 text-black transition group-hover:text-white group-hover:bg-black"
      >
        x
      </button>
    </div>
  </div>
)

export default ActiveTaskDisplay
