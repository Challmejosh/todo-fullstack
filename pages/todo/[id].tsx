import EachTodo from "@/components/oneTodo";

interface TodoType {
  id: number;
  text: string;
  completed: boolean;
}

// ✅ Use context.params to access [id]
export async function getServerSideProps(context: any) {
  try {
    const { id } = context.params; // 👈 comes from the dynamic route [id].tsx
    const res = await fetch(`http://localhost:3000/api/todos/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch todo");
    }

    const todo = await res.json();

    return { props: { todo } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { todo: null } }; // fallback
  }
}

const Todo = ({ todo }: { todo: TodoType | null }) => {
  if (!todo) {
    return <p>Todo not found</p>;
  }

  return <EachTodo todo={todo} />;
};

export default Todo;
