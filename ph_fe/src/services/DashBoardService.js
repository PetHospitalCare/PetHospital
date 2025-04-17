import axios from "../axios";
const GetBookingDataByTime = (data) => {
    return axios.get(`/dashboard/test2/${data}`);
}
const GetCountBookingByTime = (data) => {
    return axios.get(`/dashboard/test/${data}`);
}
const getStatForCard = (data) => {
    return axios.get(`/dashboard/test3/${data}`);
}


export const DashBoardServices = {
    GetCountBookingByTime, GetBookingDataByTime, getStatForCard

};
