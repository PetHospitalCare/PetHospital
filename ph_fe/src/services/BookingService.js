import axios from "../axios";

const CreateNewBooking = (data) => {
    return axios.post(`/booking/create`, data);
};
const GetAllBooking = (data) => {
    return axios.get(`/booking/get-all`);
};
const AssignDoctor = (id, doctor_id) => {
    return axios.put(`/booking/assigndoctor/${id}`, { doctor_id });
};
export const BookingServices = {
    CreateNewBooking, GetAllBooking, AssignDoctor
};
