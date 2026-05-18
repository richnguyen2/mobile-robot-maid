import Task from './Task.jsx'

const TaskList = ({ tasks, onCancel }) => {
    return (
        <div className="w-60">
            <h1 className="text-xl font-bold mb-8 text-center">
                Task List
            </h1>
            {tasks.length > 0 ? tasks.map((task) => (
                <Task key={task.id} task={task} onCancel={onCancel} />
            )) : <p className="text-center text-slate-600 pb-2">No task queued</p>}
        </div>
    )
}

export default TaskList
