import { Geist, Geist_Mono } from "next/font/google";
import TodoApp from "@/components/todo";
import { toast } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
export async function getServerSideProps() {
  try {
    const url = String(process.env.NEXT_PUBLIC_URL)
    const res = await fetch(`${url}/api/todos`);
    if (!res.ok) {
      toast.error("Connection Failed Try again")
      throw new Error("Failed to fetch todos");
    }
    const todos = await res.json();

    return { props: { todos } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { todos: [] } }; // fallback to empty list
  }
}
export default function Home({ todos }: { todos: Todo[] }) {
  return (
      <div
        className={`${geistSans.className} ${geistMono.className} font-sans  `}
      >
      <TodoApp todos={todos} />
      </div>
  );
}
