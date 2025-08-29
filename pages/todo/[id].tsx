import EachTodo from "@/components/oneTodo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

interface TodoType {
  id: number;
  text: string;
  completed: boolean;
}

export const getServerSideProps: GetServerSideProps<{ todo: TodoType | null }> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { id } = context.params as { id: string }; 
    const url = String(process.env.NEXT_PUBLIC_URL)
    const res = await fetch(`${url}/api/todos/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch todo");
    }

    const todo: TodoType = await res.json();

    return { props: { todo } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { todo: null } }; // fallback
  }
};

const Todo = ({ todo }: { todo: TodoType | null }) => {
  if (!todo) {
    return <p>Todo not found</p>;
  }

  return <EachTodo todo={todo} />;
};

export default Todo;
