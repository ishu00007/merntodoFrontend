import React, { useRef, useState } from "react";
import { Stack, Box, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useGSAP } from "@gsap/react";
import axios from "../../Axios/axios"
import gsap from "gsap"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TodoContext } from "../../context/context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignIn() {

    const todoDataFromContext = useContext(TodoContext)
    const notifySuccess = todoDataFromContext.notifySuccess
    const notifyError = todoDataFromContext.notifyError

    const userIdentity = useRef();
    const password = useRef();  
    const navigate = useNavigate()

    const [loading , setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);
        const emailOrUsername = userIdentity.current.value;
        const isEmail = emailOrUsername.includes('@') && emailOrUsername.includes('.');
        const data = {
            email: isEmail ? emailOrUsername : null,
            username: isEmail ? null : emailOrUsername,
            password: password.current.value
        };


        try {
            const result = await axios.post("/users/login", data)

            if (result.status<300 && result.status>199) {
                
                userIdentity.current.value = ""
                password.current.value = ""

                // console.log(result?.data.data);

                // todoDataFromContext.SetLoggedInUserData(result?.data?.data)

                localStorage.setItem("loggedIn" , true)

                // console.log(localStorage);


                localStorage.setItem("user" , JSON.stringify(result.data.data));

                // console.log(localStorage);
                
                // console.log(JSON.parse(localStorage.getItem("user")));

                navigate("/todos")
                notifySuccess("welcome to our to-do app")

                
            } else {
                setError("Invalid Email or Password")
                notifyError("Invalid Email or Password")

            }
        } catch (error) {
            // console.log(error)
            // setError(error.response.data ? error.response.data.match(/<pre>([^<]+)<br>/)[1].trim() : "error while signing in ")
            notifyError(error.response.data ? error.response.data.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]?.trim() : "error while signing in "   )
        } finally{
            setLoading(false)
        }
    };



    const tl = gsap.timeline()



    useGSAP(() => {
        tl.from(".sign-in-img", { x: -400, scale: 0, ease: "sine", duration: 0.5, opacity: 0 })
            .from(".heading", { y: -700, duration: 0.5 })
            .from(".inputField", { x: 800, stagger: 0.1, ease: "none", duration: 0.5 })
            .from(".sign-in-btn", { scale: 0, duration: 0.5, ease: "sine" })
    })

    return (

        <Stack
            direction={{ sm: "column", xs: "column", md: "row", lg: "row", xl: "row" }}
            maxWidth={"100%"}>
            <Stack
                alignItems={"center"}
                width={{ xs: '100%', sm: '100%', md: '60%', lg: '50%', xl: '50%' }}
                className="sign-in-img">
                <img
                    src="https://res.cloudinary.com/ishudahiya/image/upload/c_crop,h_1701/to-do/wdcpij6na6xn8v7rahse.jpg"
                    style={{ maxWidth: "670px" }}
                    width={"100%"}
                    alt="Illustration" />
            </Stack>

            <Stack
                gap="2rem"
                borderRadius={"20px"}
                width={{ sm: '70%', xs: '70%', md: '40%', lg: '50%' }}
                justifyContent={"center"}
                mx={{ sm: "auto", xs: "auto", md: "auto" }}
                alignItems={"center"} px={"25px"}
                marginBottom={{ sm: "5%", xs: "5%", md: "5%" }}>
                <Typography
                    variant="h1"
                    textAlign={"center"}
                    color={"purple"}
                    className="heading">
                    Sign In
                </Typography>
                <Stack
                    direction={"column"}
                    minWidth={"70%"}
                    alignItems={"center"}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="username or email"
                            margin="dense"
                            fullWidth
                            inputRef={userIdentity}
                            className="inputField"
                            required
                        />
                        <TextField
                            label="password"
                            margin="dense"
                            fullWidth
                            inputRef={password}
                            className="inputField"
                            required
                        />
                        <Stack
                            justifyContent={"center"}
                            mt={2}
                        // className="sign-in-btn"
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="warning"
                                disabled =  {loading ? true : false}
                                size="large"
                                className="sign-in-btn">
                                {loading ? <CircularProgress /> : <Typography variant="h6">Log in</Typography>}
                            </Button>
                            
                        </Stack>
                        <ToastContainer/>
                    </form>
                </Stack>
            </Stack>
        </Stack>

    );
}

export default SignIn;
