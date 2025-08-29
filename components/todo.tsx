"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp({ todos }: { todos: Todo[] }) {
  const url = String(process.env.NEXT_PUBLIC_URL)
  const [inputValue, setInputValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const queryClient = useQueryClient();

  /** 🔹 Fetch Todos */
  const fetchTodos = async () => {
    const allTodos = await fetch(`${url}/api/todos`);
    if (!allTodos.ok) throw new Error("failed to fetch");
    return allTodos.json();
  };

  const {
    data: todosData = todos,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialData: todos, // hydration from SSR
    staleTime: 60 * 1000 * 5,
  });

  /** 🔹 Add Todo */
  const addFetch = async (newTodo: { text: string; completed: boolean }) => {
    const res = await fetch(`${url}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    if (!res.ok) throw new Error("failed to add todo");
    return res.json();
  };

  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: addFetch,
    onMutate: async () => {
      
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
      
      setInputValue("");
      return { prevTodos };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      toast.error("Failed to add todo");
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) => (todo.id === data.id ? data : todo)) || []
    );
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
    queryClient.setQueryData<Todo[]>(["todos"], [
      ...prevTodos,
      data,
    ]);
      toast.success("Todo added successfully");
    },
  });

  /** 🔹 Update Todo */
  const patchFetch = async (todo: Todo) => {
    const res = await fetch(`${url}/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: todo.completed, text: todo.text }),
    });
    if (!res.ok) throw new Error("failed to update todo");
    return res.json();
  };

  const { mutate: patchMutate } = useMutation({
    mutationFn: patchFetch,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)) || []
      );

      return { prevTodos };
    },
    onError: (_err, _todo, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      toast.error("Failed to update todo");
    },
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) => (t.id === data.id ? data : t)) || []
      );
      toast.success("Todo updated successfully");
      setEditingId(null);
      setEditingText("");
      return { prevTodos }
    },
  });

  /** 🔹 Delete Todo */
  const deleteFetch = async (id: number) => {
    const res = await fetch(`${url}/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("failed to delete todo");
    return res.json();
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteFetch,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((t) => t.id !== id) || []
      );

      return { prevTodos };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      toast.error("Failed to delete todo");
    },
    onSuccess: () => {
      toast.success("Todo deleted successfully");
    },
  });

  /** 🔹 Handlers */
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      addMutate({ text: inputValue.trim(), completed: false });
    }
  };

  const toggleComplete = (todo: Todo) => {
    patchMutate({ ...todo, completed: !todo.completed });
  };

  const saveEdit = (id: number, text: string) => {
    const find = todosData?.find((todo: Todo) => todo.id === id);
    if (find && text.trim() !== "") {
      patchMutate({ ...find, text: text.trim() });
    }
  };

  const completedCount = todosData?.filter((todo:Todo) => todo.completed).length || 0;

  /** 🔹 UI (unchanged except todosData instead of todos) */
  return (
    <div className="min-h-dvh h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold capitalize text-white mb-2 tracking-tight">
            todos
          </h1>
          <p className="text-purple-200 text-lg">get things done, no cap</p>
        </div>

        {/* stats */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {todosData?.length}
              </div>
              <div className="text-purple-200 text-sm">total tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {completedCount}
              </div>
              <div className="text-purple-200 text-sm">completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {todosData?.length - completedCount}
              </div>
              <div className="text-purple-200 text-sm">remaining</div>
            </div>
          </div>
        </div>

        {/* add input */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="what needs to be done? 💭"
              className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white"
              disabled={isAdding}
            />
            <button
              onClick={addTodo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl"
              disabled={isAdding}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* list */}
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-purple-200">Loading...</p>
          ) : todosData.length === 0 ? (
            <p className="text-purple-200">no todos yet!</p>
          ) : (
            todosData.map((todo:Todo) => (
              <div
                key={todo.id}
                className={`bg-white/10 rounded-xl p-4 border border-white/20 ${
                  todo.completed ? "opacity-60" : "hover:bg-white/20"
                }`}
              >
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter"
                          ? saveEdit(todo.id, editingText)
                          : e.key === "Escape" && setEditingId(null)
                      }
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id, editingText)}
                      className="bg-green-500 text-white p-2 rounded-lg"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white p-2 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(todo)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        todo.completed
                          ? "bg-green-500 border-green-500"
                          : "border-white/40"
                      }`}
                    >
                      {todo.completed && (
                        <Check size={14} className="text-white" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "text-purple-300 line-through"
                          : "text-white"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditingText(todo.text);
                        }}
                        className="text-blue-400"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutate(todo.id)}
                        className="text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link
                        href={`/todo/${todo.id}`}
                        className="text-purple-400 border border-purple-400/40 px-2 rounded"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
