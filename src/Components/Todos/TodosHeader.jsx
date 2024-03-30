import React, { useRef, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Select, MenuItem, FormControl, Modal } from "@mui/material";
import axios from "../../Axios/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import DoneIcon from '@mui/icons-material/Done';

import { useContext } from "react";
import { TodoContext } from "../../context/context";


function TodosHeader() {

    const todoDataFromContext = useContext(TodoContext)

    const { notifyError, notifySuccess, btnLoading, setBtnLoading, filter, setFilter } = todoDataFromContext
    // const notifySuccess = todoDataFromContext.notifySuccess

    // const fetchTodos = todoDataFromContext.fetchTodos

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        if (JSON.stringify(localStorage.getItem("filter")) !== e.target.value)
            localStorage.setItem("filter", e.target.value)
    }

    const title = useRef();
    const description = useRef();

    const [error, setError] = useState("");

    const [open, setOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true)
        setError("");

        // console.log(title.current.value);

        const data = {
            title: title.current.value,
            description: description.current.value
        };

        // console.log(data);

        const accessToken = JSON.parse(localStorage.getItem("user"))

        const config = {
            headers: {
                Authorization: accessToken
            }
        };

        try {
            const response = await axios.post("/todo/addTodo", data, config);
            // console.log(response);
            if (response.status === 200) { 
                title.current.value = "";
                description.current.value = "";
                // console.log(response);
                notifySuccess("Todo added successfully!")
                todoDataFromContext.fetchTodos()

                todoDataFromContext.setTodos([...todoDataFromContext.todos, response.data.data])

                // console.log(todoDataFromContext.todos);


            }
        } catch (error) {
            if (error) {
                // const errorMessage = ;
                setError(error);
                notifyError(error?.response?.data.match(/<pre>([^<]+)<br>/)[1].trim());
            } else {
                setError("An error occurred while adding todo.");
                notifyError("An error occurred while adding todo.");
            }
        } finally {
            setBtnLoading(false)
            { open && setOpen(false) }
        }
    };

    return (
        <Box mt={4} >
            <>
                <Stack direction={"row"} alignItems={"center"} gap={"1.5rem"} mx={"auto"} justifyContent={"center"} >

                    <Box display={{ sm: "none", md: "none", xl: 'none', lg: 'none' }}>

                        <Button onClick={() => setOpen(true)} variant="contained" color="success">Add todo</Button>

                        <Modal open={open}>
                            <form onSubmit={handleSubmit}>
                                <Stack direction={"column"} bgcolor={"whitesmoke"} gap={4} my={15} p={5} borderRadius={5} mx={2} textAlign={"center"}>
                                    <TextField label="Title" inputRef={title} required sx={{ my: 2 }} />

                                    <TextField label="Description" inputRef={description} multiline maxRows={6} />
                                    <Box>
                                        <Button variant="contained" type="submit" color={"success"} size="large" endIcon={btnLoading ? <CircularProgress color="warning" /> : null}>Add todo</Button>

                                    </Box>

                                </Stack>
                            </form>

                        </Modal>
                    </Box>

                    <form onSubmit={handleSubmit}>

                        <Stack alignItems={"center"} gap={{ sm: 1, md: 1, lg: 4, xl: 8 }} direction={"row"} display={{ xs: "none", sm: "flex", md: "flex", lg: "flex", xl: "flex" }}>
                            <TextField label="Title" inputRef={title} required />

                            <TextField label="Description" inputRef={description} multiline maxRows={6} />

                            <Button variant="contained" type="submit" color={"success"} size="large" endIcon={btnLoading ? <CircularProgress color="warning" /> : null}>Add todo</Button>

                        </Stack>
                    </form>
                    <Box sx={{ minWidth: 120 }} display={localStorage.getItem("loggedIn" === 'true') ? false : true}>
                        <FormControl>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={localStorage.getItem("filter") ? localStorage.getItem("filter") : filter}
                                defaultValue={"All"}
                                // label="todos category"
                                onChange={handleFilterChange}
                            >
                                <MenuItem value={"All"}>all</MenuItem>
                                <MenuItem value={"Completed"} >completed</MenuItem>
                                <MenuItem value={"Uncompleted"}>uncompleted</MenuItem>
                            </Select>
                        </FormControl>

                        {/* </FormControl> */}
                    </Box>

                </Stack>

                <ToastContainer />
            </>
        </Box>
    );
}

export default TodosHeader;
