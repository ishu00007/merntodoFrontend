import React, { useContext, useState, useRef } from "react";
import axios from "../../Axios/axios";
import { TodoContext } from "../../context/context";
import { Box, Button, Stack, Card, Typography, TextField, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap'

const Todo = (props) => {

    // console.log(props._id);
    const todoDataFromContext = useContext(TodoContext);
    const { notifyError, notifySuccess, fetchTodos } = todoDataFromContext;

    const parsedUserData = JSON.parse(localStorage.getItem("user"));
    const accessToken = parsedUserData.accessToken;

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [editibility, setEditibility] = useState(false); // State to manage edit mode

    const [updating , setUpdating] = useState(false)
    const [marking , setMarking] = useState(false)
    const [deleting , setDeleting] = useState(false)

    const deleteTodo = async () => {
        setDeleting(true)
        const config = {
            headers: {
                id: props.id,
                Authorization: accessToken
            }
        };
        try {
            await axios.delete("/todo/deleteTodo", config);
            fetchTodos();
            notifySuccess("Deleted Successfully");
        } catch (error) {
            if (error) {
                const errorMessage = error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]?.trim();
                notifyError(errorMessage);
            } else {
                notifyError("An error occurred while deleting the todo");
            }
        } finally{
            setDeleting(false)
        }
    };

    const markComplete = async () => {
        // console.log('test');
        setMarking(true)
        const config = {
            headers: {
                id: props.id,
                Authorization: accessToken
            }
        };
        try {
            const response = await axios.get("/todo/toggleCompleteness", config);
            if (response.status === 200) {
                fetchTodos();
            }
        } catch (error) {
            notifyError("error while marking it complete!")
        } finally{
            setMarking(false)
        }
    };

    const updateTodo = async (e) => {
        e.preventDefault();
        setUpdating(true)
        const config = {
            headers: {
                id: props.id,
                Authorization: accessToken
            }
        };
        const data = {
            title: titleRef.current.value,
            description: descriptionRef.current.value
        };
        try {
            const response = await axios.post("/todo/updateTodo", data, config);
            if (response.status === 200) {
                fetchTodos();
                setEditibility(false);
                notifySuccess("Updated Successfully");
            }
        } catch (error) {
            console.log(error);
        } finally{
            setUpdating(false)
        }
    };


    return (    
        <Card elevation={24} sx={{ maxWidth: "100%", border: "2px solid grey", position: "relative" }}  >
            <Stack sx={{ p: 2 }} textAlign={"center"} gap={2}>
                {editibility ? (
                    <form onSubmit={updateTodo}>
                        <Stack gap={2} >
                            <TextField defaultValue={props.title} inputRef={titleRef} />
                            <TextField defaultValue={props.description} placeholder={"Enter the description"} inputRef={descriptionRef} />
                            <Box>
                                <Button color="error" sx={{ mx: "5px" }} variant="contained" onClick={() => setEditibility(false)}> <ClearIcon /> </Button>
                                <Button sx={{ mx: "5px" }} color="success" variant="contained" type="submit" disabled={updating? true : false} >{updating ? <CircularProgress color="warning"/> : <SaveIcon/>} </Button>
                            </Box>
                        </Stack>
                        
                    </form>
                ) : (
                
                    <Stack gap={2} p={2} direction={{xs : "column" , sm : "column" , md : "column" , lg : "column" , xl :"column"}} justifyContent={{xs:"space-between"}}>
                        <Typography variant="h6" fontFamily={"monospace"} fontWeight={900}>{props.title || "Title"}</Typography>
                        <Typography display={{xs:"none" , sm : "block" , md : "block" , lg : "block" , xl : "block"}} variant="body1" fontFamily={"monospace"}>{props.description || "Description"}</Typography>
                        <Stack direction={'row'} justifyContent={"center"}>
                            <Button variant="contained" color="error" sx={{ marginX: "5px" }} onClick={deleteTodo} disabled={deleting? true : false} >{deleting ? <CircularProgress color="error"/> :<DeleteIcon />}</Button>

                            { props.completed ? <Button color="inherit" variant="contained" disabled>Completed</Button> : (<><Button variant="outlined" sx={{ marginX: "5px" }} onClick={() => setEditibility(true)} > <EditIcon /> </Button>
                            <Button variant="contained" color="success" sx={{ marginX: "5px" }} onClick={markComplete} disabled={marking ? true : false}>{marking ? <CircularProgress color="success"/> : <DoneIcon />}</Button></>)}
                        </Stack>
                        <Box position={"absolute"} top={0} right={0} bgcolor={"wheat"} borderRadius={"50px"}>{props.completed ? <DoneIcon color="success" fontSize="large" /> : null}</Box>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
};

export default Todo;
