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

export const PaymentService = {
    updatePayment, getPaymentsByUserId, getAllPayments, cancelOrder
};
