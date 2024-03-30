import { Avatar, Stack, Switch, TextField, Typography, Box, styled, Button, CircularProgress, Modal } from "@mui/material";
import React, { useContext, useDebugValue, useEffect, useRef, useState } from "react";
import axios from "../../Axios/axios"
import { TodoContext } from "../../context/context";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const [avatarUrl, setAvatarUrl] = useState("")
    const [editable, setEditable] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem("user")) || {};
    const userAvatar = avatarUrl ? avatarUrl : localStorage.getItem("userAvatar")
    const details = ['name', 'username', 'email', 'age'];
    const nameRef = useRef()
    const usernameRef = useRef()
    const emailRef = useRef()
    const ageRef = useRef()
    const passwordRef = useRef()
    const [updatingAvatar, setUpdatingAvatar] = useState(false)
    const todoDataFromContext = useContext(TodoContext)

    const [open, setOpen] = useState(false)

    const { notifyError, notifySuccess } = todoDataFromContext


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    var avatar;

    const handleAvatarSelect = (e) => {
        const selectedFile = e.target.files[0];

        // Check if a file is selected and if it's an image file
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            avatar = selectedFile;
            updateAvatar();
        } else {
            // Notify the user that only image files are allowed
            notifyError("Only images are allowed");
            alert("only images are allowed")
        }
    }

    const updateAvatar = async () => {
        setUpdatingAvatar(true)
        const formData = new FormData()
        formData.append("avatar", avatar)

        const config = {
            headers: {
                Authorization: JSON.parse(localStorage.getItem("user")).accessToken,
                id: JSON.parse(localStorage.getItem("user"))._id.toString()
            }
        };

        try {
            const response = await axios.post("/users/updateAvatar", formData, config)

            if (response.status === 200) {
                console.log(response);
                // console.log(localStorage);
                localStorage.setItem("userAvatar", response.data.data.avatar)
                setAvatarUrl(localStorage.getItem("userAvatar"))

            }
        } catch (error) {
            console.log(error);
            notifyError(error.response.data ? error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]?.trim() : "error while updating profile")
        } finally {
            setUpdatingAvatar(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: JSON.parse(localStorage.getItem("user")).accessToken,
                id: JSON.parse(localStorage.getItem("user"))._id.toString()
            }
        };
        ;

        console.log(JSON.parse(localStorage.getItem("user")));

        const updatingFields = { password: passwordRef.current.value };

        if (userDetails.age !== ageRef.current.value) {
            updatingFields.age = ageRef.current.value;
        }
        if (userDetails.username !== usernameRef.current.value) {
            updatingFields.username = usernameRef.current.value;
        }
        if (userDetails.name !== nameRef.current.value) {
            updatingFields.name = nameRef.current.value;
        }
        if (userDetails.email !== emailRef.current.value) {
            updatingFields.email = emailRef.current.value;
        }

        try {
            const response = await axios.post("/users/updateProfile", updatingFields, config);

            if (response.status === 200) {
                // console.log(response.data.data);
                // console.log(localStorage);
                localStorage.setItem("user", JSON.stringify(response?.data?.data));
                notifySuccess(response.data.message);
                setEditable(false)
            }
        } catch (error) {
            console.log(error);
            // console.log(localStorage);
            notifyError(error.response.data ? error.response.data.match(/<pre>([\s\S]*?)<br>/)?.[1]?.trim() : "Error while updating profile");
        }
    };


    function getInputRef(item) {
        if (item === "name") {
            return nameRef
        } else if (item === "email") {
            return emailRef
        } else if (item === "age") {
            return ageRef
        } else if (item === "username") {
            return usernameRef
        }
    }

    return (
        <Stack px={{sx:4 , sm : 5 , md : 8 , lg : 15 , xl : 15}} pt={5} direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }} gap={{xs:4 , sm : 5 , md : 7 , lg : 15 , xl : 15}} textAlign={"left"} alignItems={"center"}>
            <Stack justifyContent={"center"} width={"30%"} sx={{ padding: "none", margin: "none" }} >
                <Button component="label">
                    {editable ? <VisuallyHiddenInput type="file" onChange={handleAvatarSelect} /> : null}
                    {updatingAvatar ? <CircularProgress /> : <Avatar src={userAvatar} sx={{ width: { xs: 200, lg: 300 }, height: { xs: 200, lg: 300 } }} />}
                    <ToastContainer />
                </Button>
            </Stack>

            <Stack alignItems={"center"} width={"100%"}>
                <Switch onClick={() => setEditable(!editable)} style={{}} />
                <Stack width={"100%"}> 
                    <form  onSubmit={handleSubmit}>
                        {details.map(item => (
                            <React.Fragment key={item}>
                                <Typography>{item}</Typography>
                                <TextField
                                    inputRef={getInputRef(item)}
                                    defaultValue={userDetails[item]}
                                    disabled={!editable}
                                    bgcolor={!editable ? "lightgray" : undefined}
                                    fullWidth
                                />
                            </React.Fragment>

                        ))}
                        <Typography>Password</Typography>
                        <TextField
                            type="password"
                            inputRef={passwordRef}
                            disabled={!editable}
                            bgcolor={!editable ? "lightgray" : undefined}
                            required
                            fullWidth
                        />
                        <Button type="submit" disabled={!editable} sx={{ display: !editable && "none" }} color="success" size="large">Update</Button>
                    </form>
                </Stack>
            </Stack>

            {/* <Modal open={open} onClose={() => setOpen(false)}>
                <Stack bgcolor={"white"} maxWidth={"400px"} gap={7} p={3}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="caption">Enter password to update</Typography>
                        <TextField placeholder="Enter password here" type="password" inputRef={passwordRef} autoComplete="true" />
                        <Button type="submit">Update</Button>
                    </form>

                    
                </Stack>
            </Modal> */}
        </Stack>

    );
}

export default Profile;
