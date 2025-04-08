import axios from "axios"

const instance = axios.create({
    baseURL: "https://pethospital.onrender.com",
    // baseURL: "http://localhost:9999",
    withCredentials: true,
});

instance.defaults.withCredentials = true;

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response
    }, (error) => {
        const status = (error.response && error.response.status) || 500;
        switch (status) {
            // authentication (token related issues)
            case 401: {
                return error.response.data
            }

            // forbidden (permission related issues)
            case 403: {
                return error.response.data
            }

            // bad request
            case 400: {
                return error.response.data
            }

            // not found
            case 404: {
                return error.response.data
            }

            // conflict
            case 409: {
                return error.response.data
            }

            // unprocessable
            case 422: {
                return error.response.data
            }

            // generic api error (server related) unexpected
            default: {
                return error.response.data
            }
        }
    }
);

export default instance;
