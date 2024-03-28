import {Route , createBrowserRouter , createRoutesFromElements , RouterProvider} from "react-router-dom"
import Home from "./Components/Home/Home"
import Layout from "./Components/Layout/Layout"
import "./App.css"
import SignIn from "./Components/SignIn/SignIn"
import Todos from "./Components/Todos/Todos"
import ContextProvider from "./context/context"
import Developer from "./Components/Developer/Developer"
import Profile from "./Components/Profile/profile"



function App(){

const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<Layout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/signIn" element={<SignIn/>}/>
        <Route path="/todos" element={<Todos/>}/>
        <Route path="/developer" element={<Developer/>}/>
        <Route path="/profile" element={<Profile/>}/>
    </Route>
))

    return(
        <ContextProvider>
            <RouterProvider router={router} />            
        </ContextProvider>

    )
}

export default App