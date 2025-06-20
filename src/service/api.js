import axios from "axios";
const API_URL = "https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f";

export const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
}