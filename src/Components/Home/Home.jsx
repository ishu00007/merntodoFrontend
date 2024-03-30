import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from '@gsap/react'
import gsap from "gsap"
// import Axios from "axios"
import axios from "../../Axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodoContext } from "../../context/context";


function Home() {
    const nameRef = useRef();
    const emailRef = useRef();
    const ageRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();

    const navigate = useNavigate()

    const todoDataFromContext = useContext(TodoContext)
    const notifySuccess = todoDataFromContext.notifySuccess
    const notifyError = todoDataFromContext.notifyError

    const [errorMessage, setErrorMessage] = useState()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setLoading(true)
        // Access current values from the refs

        const data = {
            username: usernameRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            age: ageRef.current.value,
            password: passwordRef.current.value
        };

        try {
            const response = await axios.post("/users/signUp", data)

            // console.log(response);
            // const responseData = await response.json()
            if (response.ok || response.status < 300 && response.status > 199) {
                console.log(response)
                nameRef.current.value = ""
                ageRef.current.value = ""
                usernameRef.current.value = ""
                emailRef.current.value = ""
                passwordRef.current.value = ""
                notifySuccess("Your new account created :)")
                navigate("/signIn")
            } else {
                notifyError("Registeration failed")
                throw new Error(response.message || 'Registration failed');

            }
        } catch (error) {
            console.log(error);
            // setErrorMessage(error.response?.data.match(/<pre>([^<]+)<br>/)[1].trim() || 'Registration failed' || error.message);
            notifyError(
                (error.response?.data && error.response.data.match(/<pre>([\s\S]*?)<br>/)?.[1]?.trim())
            );
        } finally {
            setLoading(false)
        }


    };

    var tl = gsap.timeline()

    useGSAP(() => {
        tl.from(".homeImage", { x: -900, duration: 1, ease: "sine.inOut" })
            .from(".sign-up", { y: -800, duration: 0.4, ease: "circ.inOut", yoyo: true })
            .fromTo(".textfield", 0.2, { opacity: 0, scale: 0, x: 300 }, { opacity: 1, scale: 1, x: 0, stagger: 0.1 })
            .fromTo(".newAcc", 1, { scale: 0, y: 800 }, { scale: 1, y: 0 })
    })


    return (
        <Stack direction={{ lg: "row", xl: "row" }} justifyContent={"space-evenly"} maxWidth={"100vw"} alignItems={"center"}>
            <Box width={{ md: "50%", sm: "100%", xs: "100%" }} >
                <img src="https://res.cloudinary.com/ishudahiya/image/upload/v1710514696/to-do/qneuuwpin8fdjtzdozcc.jpg" width={"100%"} alt="Illustration" className="homeImage" />
            </Box>
            <Stack alignContent={"center"} padding={{ xs: "15px 0px", md: "25px 0px", lg: "50px 0" }} width={{ lg: "40%", xl: "40%", sm: "80%", xs: "80%", md: "40%" }} gap={"0.9rem"}>
                <Typography textAlign={"center"} color={"red"} variant="h1" margin="0px 0px" className="sign-up">Sign Up</Typography>
                <Box>
                    <form onSubmit={handleSubmit}>
                        <TextField required label="name" placeholder="enter your name" fullWidth margin="dense" inputRef={nameRef} className="textfield" />
                        <TextField required label="username" placeholder="enter your username" fullWidth margin="dense" inputRef={usernameRef} className="textfield" />
                        <TextField required label="email" placeholder="enter your email" fullWidth margin="dense" inputRef={emailRef} className="textfield" />
                        <TextField required label="age" placeholder="enter your age" fullWidth type="number" margin="dense" inputRef={ageRef} className="textfield" />
                        <TextField required type="password" helperText="password must have an uppercase , lowercase , number and a special character" placeholder="enter your password" label="password" fullWidth margin="dense" inputRef={passwordRef} className="textfield" />
                        <Stack textAlign={"center"} direction={"column"}>
                            <Button variant="contained" sx={{ margin: "10px 0px" }} disabled={loading ? true : false} type="submit" className="newAcc" size="large">{loading ? <CircularProgress /> : <>Create New Account</>}</Button>

                        </Stack>
                        <ToastContainer />
                    </form>
                    <Stack direction={"row"} gap={"20px"} alignItems={"center"} justifyContent={"center"} className="newAcc">
                        <Typography>Already have an account?</Typography>
                        <>
                            <Link to={"/signIn"} style={{ textDecoration: "none", color: "inherit" }}>Sign In</Link>
                        </>

                    </Stack>
                </Box>

            </Stack>
        </Stack>
    );
}

export default Home;
