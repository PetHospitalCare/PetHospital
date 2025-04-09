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

export const PaymentService = {
    updatePayment, getPaymentsByUserId, getAllPayments
};
