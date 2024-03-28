import { Avatar, Stack, Switch, TextField, Typography, Box, styled, Button , CircularProgress } from "@mui/material";
import React, { useState } from "react";
import axios from "../../Axios/axios"

function Profile() {
    const [editable, setEditable] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem("user")) || {};
    const userAvatar = localStorage.getItem("userAvatar") || userDetails.avatar;
    const details = ['name', 'username', 'email', 'age'];
    const [updatingAvatar, setUpdatingAvatar] = useState(false)

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
        avatar = e.target.files[0]

        if (avatar !== null || undefined) {
            updateAvatar()
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
                
                localStorage.setItem("userAvatar" , response.data.data.avatar)
                GetLoggedInUserDetails()
                setAvatarUrl(JSON.parse(localStorage.getItem('user')).avatar.toString())
                
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdatingAvatar(false)
        }
    }


    return (
        <Stack px={5} pt={5} direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }} gap={15}>
            <Box >
                <Button  component="label"
                //   role={undefined}
                  
                //   tabIndex={-1}
                  >
                    {editable ? <VisuallyHiddenInput type="file" onChange={handleAvatarSelect} /> : null}
                    
                        {updatingAvatar ? <CircularProgress /> : <Avatar src={userAvatar} sx={{ width: { xs: 100, lg: 300 }, height: { xs: 100, lg: 300 } }}/>}

                    
                </Button>

            </Box>

            <Stack width={"50%"}>
                <Switch onClick={() => setEditable(!editable)} />
                {details.map(item => (
                    <>
                        <Typography>{item}</Typography>
                        <TextField
                            defaultValue={userDetails[item]}
                            disabled={!editable}
                            width={"80%"}
                            bgcolor={!editable ? "lightgray" : undefined}
                        />
                    </>
                ))}
            </Stack>
        </Stack>
    );
}

export default Profile;
