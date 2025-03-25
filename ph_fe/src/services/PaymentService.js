import axios from "../axios";

const updatePayment = (data) => {
    return axios.post(`/payment/update-payment`, data);
}

export const PaymentService = {
    updatePayment
};
