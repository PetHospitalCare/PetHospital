import axios from "../axios";

const CreateNewBooking = (data) => {
    return axios.post(`/booking/create`, data);
};
const GetAllBooking = (data) => {
    return axios.get(`/booking/get-all`);
};
export const BookingServices = {
    CreateNewBooking, GetAllBooking
};
