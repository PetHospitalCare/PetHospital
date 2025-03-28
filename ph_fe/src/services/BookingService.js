import axios from "../axios";

const CreateNewBooking = (data) => {
    return axios.post(`/booking/create`, data);
};
const GetAllBooking = (data) => {
    return axios.get(`/booking/get-all`);
};
const GetHistoryBooking = (data) => {
    return axios.get(`/booking/get-booking-by-user`);
};
const AssignDoctor = (id, doctor_id) => {
    return axios.put(`/booking/assigndoctor/${id}`, { doctor_id });
};
const UpdateBooking = (id, data) => {
    return axios.put(`/booking/update/${id}`, data);
}
const GetBookingbyId = (id) => {
    return axios.get(`/booking/get-by-id/${id}`);
}
const CancelBooking = (id) => {
    return axios.get(`/booking/cancel/${id}`);
}
const getAllBookingByStatus = (status) => {
    return axios.get(`/booking/get-by-status/${status}`);
}
const CreatePaymentBooking = (id) => {
    return axios.get(`/booking/createpayment/${id}`);
}
const UpdatePayByCash = (id) => {
    return axios.get(`/booking/pay-by-cash/${id}`);
}
export const BookingServices = {

    CreateNewBooking, GetAllBooking, AssignDoctor, UpdateBooking, GetBookingbyId, GetHistoryBooking, CancelBooking,
    getAllBookingByStatus, CreatePaymentBooking, UpdatePayByCash
};
