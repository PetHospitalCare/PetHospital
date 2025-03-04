import axios from "../axios";

const CreateNewBooking = (data) => {
    return axios.post(`/booking/create`, data);
};

export const BookingServices = {
    CreateNewBooking
};
