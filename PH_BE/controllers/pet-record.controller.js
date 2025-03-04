const db = require("../models");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const getAllPetRecords = async (req, res) => {
    try {
        const pets = await db.pet.find();

        const customers = await db.customer.find();

        const petRecords = pets.map(pet => {
            const customer = customers.find(c => c.pet_id === pet.pet_id);

            if (customer) {
                return {
                    customer_id: customer.customer_id,
                    customer_name: customer.name,
                    phoneNumber: customer.phone_number,
                    pet_name: pet.name
                };
            }

            return null;
        }).filter(record => record !== null && record !== undefined);

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách bản ghi thú cưng thành công',
            petRecords,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { getAllPetRecords };