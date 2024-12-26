import React from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  title: string;
  onToggleComplete: (task: Task) => void;
  onRemove: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title, onToggleComplete, onRemove, onEdit }) => {

  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState<string>("");

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
  };

  const saveEdit = (task: Task) => {
    onEdit({ ...task, title: newTitle });
    setEditingTaskId(null);
    setNewTitle("");
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-1 h-9">
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border p-1"
              />
            ) : (
              <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            )}
            <div className="grid grid-cols-3 gap-2">
              {editingTaskId === task.id ? (
                <button
                  onClick={() => saveEdit(task)}
                  className="bg-blue-500 text-white rounded px-2 hover:bg-blue-900 ease-out duration-300 w-24"
                >
                  Зберегти
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white rounded px-2 hover:bg-yellow-900 ease-out duration-300 w-24"
                >
                  Редагувати
                </button>
              )}
              <button
                onClick={() => onToggleComplete(task)}
                className="bg-green-500 text-white rounded px-2 hover:bg-green-900 ease-out duration-300"
              >
                {task.completed ? "Скасувати" : "Виконано"}
              </button>
              <button
                onClick={() => onRemove(task)}
                className="bg-red-500 text-white rounded hover:bg-red-900 ease-out duration-300"
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;