import axios from "../axios";

const updatePayment = (data) => {
    return axios.post(`/payment/update-payment`, data);
}

const getPaymentsByUserId = (userId) => {
    return axios.get(`/payment/get-payments${userId}`);
}

export const PaymentService = {
    updatePayment, getPaymentsByUserId
};
