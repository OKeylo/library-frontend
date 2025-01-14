import axios from "axios";

export async function getBooks() {
    const response = await axios.get(
        "http://127.0.0.1:8000/books_with_parameters"
    );
    
    return response.data;
}