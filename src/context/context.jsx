import React, { createContext, useContext, useState } from "react";
import { toast } from 'react-toastify';
import axios from "../Axios/axios";

export const TodoContext = createContext({
    SetLoggedInUserData: ""
    , loggedInUserData: ""
    , todos: ""
    , setTodos: ""
    , setTotalTodos: ""
    , notifySuccess: ""
    , notifyError: ""
    , fetchTodos: ""
    , loading: ""
    , setLoading: ""
    , btnLoading: ""
    , setBtnLoading: ""
    , totalTodos: ""
    , totalCompletedTodos: ""
    , completedTodos: ""
    , uncompletedTodos: ""
    , totalUnCompletedTodos: ""
    , filter: ""
    , setFilter: ""
    , GetLoggedInUserDetails : ""
    , avatarUrl : ""
    , setAvatarUrl : ""
});

const ContextProvider = ({ children }) => {

    const [todos, setTodos] = useState();
    const [totalTodos, setTotalTodos] = useState(0)
    const [totalCompletedTodos, settotalCompletedTodos] = useState(0)
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [completedTodos, setCompletedTodos] = useState([])
    const [totalUnCompletedTodos, setTotalUnCompletedTodos] = useState([])
    const [uncompletedTodos, setUncompletedTodos] = useState(0)
    const [filter, setFilter] = useState("All")
    const [avatarUrl , setAvatarUrl] = useState("")

    const notifySuccess = (message) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark"
        });
    };

    const notifyError = (error) => {
        toast.error(error, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark"
        });
    };

    const fetchTodos = async () => {
        // console.log('test');
        try {
            const parsedUserData = JSON.parse(localStorage.getItem("user"));
            const accessToken = parsedUserData.accessToken;

            const config = {
                headers: {
                    Authorization: accessToken
                }
            };

            const response = await axios.get("/users/getalltodos", config);
            // console.log(response);
            const newTodos = response.data.data[0];


            // console.log(JSON.stringify(newTodos.todos));
            // console.log(JSON.stringify(todos));
            if (JSON.stringify(todos) !== JSON.stringify(newTodos?.todos)) {

                // setTotalTodos(newTodos.todos);
                if (JSON.stringify(newTodos.todos) !== JSON.stringify(todos)) {
                    setTodos(newTodos.todos)
                }
                if (totalTodos !== newTodos.totalTodos) {
                    setTotalTodos(newTodos.totalTodos)
                }
                if (newTodos.totalUnCompletedTodos !== uncompletedTodos) {
                    setTotalUnCompletedTodos(newTodos.totalUncompletedTodos)
                }
                if (JSON.stringify(newTodos.completedTodos) !== JSON.stringify(completedTodos)) {
                    setCompletedTodos(newTodos.completedTodos)
                }
                if (JSON.stringify(newTodos.uncompletedTodos) !== JSON.stringify(uncompletedTodos)) {
                    setUncompletedTodos(newTodos.uncompletedTodos)
                }
                if (totalCompletedTodos !== newTodos.totalCompletedTodos) {
                    settotalCompletedTodos(newTodos.totalCompletedTodos)
                }



                // setUncompletedTodos(newTodos.uncompletedTodos)

            }
            // console.log(todos);
        } catch (error) {
            console.error(error);
        } finally {
            // console.log(todos);
            setLoading(false)
        }
    }


    const [loggedInUserData, setLoggedInUserData] = useState()

    const GetLoggedInUserDetails = async () => {
        const config = {
            headers: {
                Authorization: JSON.parse(localStorage.getItem("user")).accessToken,
                id: JSON.parse(localStorage.getItem("user"))._id.toString()
            }
        }

        try {
            const response = await axios.get("/users/getLoggedInUser", config)
            if (response.status === 200) {
                // console.log(response);
                localStorage.setItem("userAvatar" , JSON.stringify(response?.data?.data?.avatar))
                // console.log(JSON.parse(localStorage.getItem("userAvatar")));
            }
        } catch (error) {
            console.log(error);
        }
    }



    const value = { 
        setLoggedInUserData, 
        loggedInUserData, 
        todos, 
        setTodos, 
        totalTodos, 
        setTotalTodos, 
        notifySuccess, 
        notifyError, 
        fetchTodos, 
        loading, 
        setLoading, 
        btnLoading, 
        setBtnLoading, 
        totalCompletedTodos, 
        completedTodos, 
        uncompletedTodos, 
        totalUnCompletedTodos, 
        filter, 
        setFilter ,
        GetLoggedInUserDetails ,
        avatarUrl , 
        setAvatarUrl
        }

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};

// Custom hook to consume the context
// export const useTodoContext = () => useContext(TodoContext);

export default ContextProvider;