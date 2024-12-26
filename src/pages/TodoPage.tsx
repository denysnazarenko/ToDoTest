import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase.ts";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import TaskList from "../components/taskList/TaskList.tsx";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [category, setCategory] = useState<string>("Home");

  const [role, setRole] = useState<string>("user");
  const [emailToAdd, setEmailToAdd] = useState<string>("");
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTasks(docSnap.data().tasks || []);
          setRole(docSnap.data().role || "user");
        }
      } else {
        navigate("/login");
      }
    };
    fetchTasks();
  }, [navigate]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      category,
    };
    const userRef = doc(db, "users", auth.currentUser!.uid);
    await updateDoc(userRef, {
      tasks: arrayUnion(task),
    });
    setTasks((prev) => [...prev, task]);
    setNewTask("");
  };

  const removeTask = async (task: Task) => {
    const userRef = doc(db, "users", auth.currentUser!.uid);
    await updateDoc(userRef, {
      tasks: arrayRemove(task),
    });
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  const toggleComplete = async (task: Task) => {
    const userRef = doc(db, "users", auth.currentUser!.uid);

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );

    await updateDoc(userRef, {
      tasks: updatedTasks,
    });

    setTasks(updatedTasks);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const editTask = async (updatedTask: Task) => {
    const userRef = doc(db, "users", auth.currentUser!.uid);

    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    await updateDoc(userRef, {
      tasks: updatedTasks,
    });

    setTasks(updatedTasks);
  };

  const handleAddUser = async () => {
    try {
      const userRef = doc(db, "users", emailToAdd);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setError("Користувач з такою електронною поштою вже існує.");
      } else {
        await setDoc(doc(db, "users", emailToAdd), {
          email: emailToAdd,
          role: "user",
          tasks: [],
        });

        setShowAddUserModal(false);
        setEmailToAdd("");
        setError(null);
      }
    } catch (err) {
      setError("Сталася помилка при додаванні користувача.");
    }
  };

  const homeTasks = tasks.filter((task) => task.category === "Home");
  const workTasks = tasks.filter((task) => task.category === "Work");

  return (
    <div className="p-6 container xl mx-auto">
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-6 hover:bg-red-900 ease-out duration-300 mr-6">
        Вийти
      </button>

      {role === "superAdmin" && (
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-900 ease-out duration-300"
        >
          Додати користувача
        </button>
      )}

      {showAddUserModal && (
        <div className="modal mb-10">
          <h3>Додати користувача</h3>
          <input
            type="email"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            placeholder="Введіть електронну пошту"
            className="border p-2 mb-2 w-full"
          />
          <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 mr-2">
            Додати
          </button>
          <button
            onClick={() => setShowAddUserModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-2"
          >
            Закрити
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}

      <div className="mb-5">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Додати нову задачу"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 mr-2">
          <option value="Home">Дім</option>
          <option value="Work">Робота</option>
        </select>
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900 ease-out duration-300">
          Додати завдання
        </button>
      </div>
      <TaskList
        title="Домашні задачі"
        tasks={homeTasks}
        onToggleComplete={toggleComplete}
        onRemove={removeTask}
        onEdit={editTask}
      />
      <TaskList
        title="Робочі задачі"
        tasks={workTasks}
        onToggleComplete={toggleComplete}
        onRemove={removeTask}
        onEdit={editTask}
      />
    </div>
  );
};

export default TodoPage;