// @ts-nocheck
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import settings from "./config";

function App() {
  console.log("WHICH_ENV:!!!! ", settings.WHICH_ENV);
  console.log("API_BASE:!!!! ", settings.BASE_API_URL);

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      const response = await axios.get(settings.BASE_API_URL);
      setTodos(response.data);
    };

    getTodos();
  }, []);

  return (
    <div>
      <p>Todos</p>
      {todos.map((t) => (
        <li key={t._id}>{t.task}</li>
      ))}
    </div>
  );
}

export default App;
