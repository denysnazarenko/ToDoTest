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
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title, onToggleComplete, onRemove }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => onToggleComplete(task)} className="bg-green-500 text-white rounded px-2 hover:bg-green-900 ease-out duration-300 w-24">
                {task.completed ? "Скасувати" : "Виконано"}
              </button>
              <button onClick={() => onRemove(task)} className="bg-red-500 text-white rounded hover:bg-red-900 ease-out duration-300">
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