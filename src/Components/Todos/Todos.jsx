import React, { useEffect, useContext } from "react";
import TodosHeader from "./TodosHeader";
import Todo from "./Todo";
// import axios from "axios"; // Uncomment this if axios is needed

import { Button, Grid, Stack, Typography, CircularProgress } from "@mui/material";
import { TodoContext } from "../../context/context";
import { Link } from "react-router-dom";

function Todos() {
    const { todos, fetchTodos, loading, completedTodos, uncompletedTodos } = useContext(TodoContext);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]); // Run fetchTodos only when fetchTodos function changes

    const getFilteredTodos = () => {
        const filterValue = localStorage.getItem("filter");
        switch (filterValue) {
            case "Completed":
                return completedTodos;
            case "Uncompleted":
                return uncompletedTodos;
            default:
                return todos;
        }
    };

    return (
        <Stack direction="column" gap={5} mx={{ xs: 4, sm: 8, md: 10, lg: 15, xl: 20 }} mb={10}>
            {localStorage.getItem("loggedIn") === 'true' ? (
                <>
                    <TodosHeader />
                    {loading ? (
                        <Stack justifyContent={"center"} alignItems={"center"}>
                            <CircularProgress />
                        </Stack>
                    ) : todos && todos.length > 0 ? (
                        <Grid container direction="row" spacing={4}>
                            {getFilteredTodos().map((todo) => (
                                <Grid item key={todo._id} xs={12} sm={6} md={6} lg={4}>
                                    <Todo title={todo.title} description={todo.description} id={todo._id} completed={todo.completed} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="h1" fontWeight={900} textAlign={"center"}>
                            Nothing to do
                        </Typography>
                    )}
                </>
            ) : (
                <Stack justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={4} my={{ xs: 5, md: 18, lg: 25 }}>
                    <Typography variant="h1" fontFamily={"monospace"}>
                        YOU MUST LOGIN FIRST!
                    </Typography>
                    <Stack direction={"row"} gap={4} alignItems={"center"}>
                        <Link to={"/signIn"}>
                            <Button variant="contained" size="large" color="success">
                                Log in now
                            </Button>
                        </Link>
                        <Link to={"/"}>
                            <Button variant="contained" size="large" color="secondary" sx={{ fontSize: 21 }}>
                                Sign up now
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}

export default Todos;
