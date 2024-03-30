import axios from "axios"
const instance = axios.create({
    baseURL : "http://localhost:8000/api/v1"         
    // baseURL : "https://merntodobackend-ks6z.onrender.com/api/v1"
})

export default instance