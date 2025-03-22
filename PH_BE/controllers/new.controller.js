const db = require("../models");
const New = db.new;

const CreateNews = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = new New({
            title,
            content
        });
        await newPost.save();

        res.status(201).json({
            success: true,
            news: newPost
        });
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
};

const GetAllNews = async (req, res) => {
    try {
        const news = await New.find()

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            news,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};


module.exports = { CreateNews, GetAllNews };