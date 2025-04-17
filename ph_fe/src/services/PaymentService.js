import axios from "../axios";

const updatePayment = (data) => {
    return axios.post(`/payment/update-payment`, data);
}

const getPaymentsByUserId = (userId) => {
    return axios.get(`/payment/get-payments${userId}`);
}

const getAllPayments = () => {
    return axios.get(`/payment/get-all-payments`);
}

const cancelOrder = (paymentId) => {
    return axios.post(`/payment/cancel-order${paymentId}`);
}

const updatePaymentStatus = (data) => {
    return axios.post(`/payment/update-payment-status`, data);
}

const deletePayment = (paymentId) => {
    return axios.delete(`/payment/delete-payment${paymentId}`);
}

export const PaymentService = {
    updatePayment, getPaymentsByUserId, getAllPayments, cancelOrder, updatePaymentStatus, deletePayment
};
