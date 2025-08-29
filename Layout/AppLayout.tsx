'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const client = new QueryClient()
const AppLayout = ({children}:{children:ReactNode}) => {
    return ( 
        <QueryClientProvider client={client}>
            <ToastContainer/>
            {children}
        </QueryClientProvider>
     );
}
 
export default AppLayout;