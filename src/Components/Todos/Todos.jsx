import React, { useEffect, useState, useContext } from "react";
import TodosHeader from "./TodosHeader";
import Todo from "./Todo";
// import axios f

import { Button, Grid, Stack, Typography, Container, Box } from "@mui/material";
import { TodoContext } from "../../context/context";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

function Todos() {
    const { todos, fetchTodos, loading, completedTodos, uncompletedTodos, filter } = useContext(TodoContext);


    useEffect(() => {
        fetchTodos()

    }, [todos]); // Run fetchTodos only when todos array changes


    const getFilteredTodos = () => {
        if (localStorage.getItem("filter") === "All") {
            return todos
        } else if (localStorage.getItem("filter") === "Completed") {
            return completedTodos
        } else if (localStorage.getItem("filter") === "Uncompleted") {
            return uncompletedTodos
        }
    }



    return (
        <Stack direction="column" gap={5} mx={{ xs: 4, sm: 8, md: 10, lg: 15, xl: 20 }} mb={10}>

            {localStorage.getItem("loggedIn") === 'true' ? (<><TodosHeader />
                {loading ? (
                    <Stack justifyContent={"center"} alignItems={"center"}><CircularProgress /> </Stack>// Show loading indicator while fetching todos
                ) : todos ? (
                    <Grid container direction="row" spacing={4}>
                        {getFilteredTodos().map((todo) => (
                            <Grid item key={todo._id} xs={12} sm={6} md={6} lg={4}>
                                <Todo title={todo.title} description={todo.description} id={todo._id} completed={todo.completed} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h1" fontWeight={900} textAlign={"center"}>Nothing to do</Typography>
                )}</>) : <Stack justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={4} my={{ xs: 5, md: 18, lg: 25 }}>
                <Typography variant="h1" fontFamily={"monospace"}>YOU MUST LOGIN FIRST!</Typography>
                <Stack direction={'row'} gap={4} alignItems={"center"}>
                    <Link to={'/signIn'} ><Button variant="contained" size="large" color="success">Log in now</Button></Link>
                    <Link to={'/'} ><Button variant="contained" size="large" color="secondary" sx={{ fontSize: 21 }}>Sign up now</Button></Link>
                </Stack>

            </Stack>}
        </Stack>
    );
}

export default Todos;
