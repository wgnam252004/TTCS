import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1/auth',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


const useAxiosInstance = () => {
    return axiosInstance;
}

export default useAxiosInstance;