'use client'
interface TodoType {
    id: number;
    text: string;
    completed: boolean;
}
const EachTodo = ({todo}:{todo:TodoType}) => {
    // const url = String(process.env.NEXT_PUBLIC_BACKEND_API )
    // const fetchTodo = async () => {
    //     const res = await fetch(`http:localhost:3000/api/todos/${id}`);
    //     if (!res.ok) throw new Error('failed to fetch');
    //     const data = await res.json();
    //     return data
    // };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Todo Details</h2>
                    <p className="text-purple-200 text-md">See your task in detail</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-white/40'}`}>
                            {todo.completed ? <span className="text-white">✔️</span> : null}
                        </span>
                        <span className={`flex-1 text-lg ${todo.completed ? 'text-purple-300 line-through' : 'text-white'}`}>{todo.text}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${todo.completed ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>{todo.completed ? 'Completed' : 'Pending'}</span>
                        <span className="px-3 py-1 rounded-full text-xs bg-purple-400/30 text-purple-100">ID: {todo.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EachTodo