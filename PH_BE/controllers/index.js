const ProductController = require('./product.controller');
const CategoryController = require('./category.controller');
const ServiceController = require('./service.controller')
const AccountController = require("./account.controller")
const OTPController = require("./otp.controller");
const MedicineController = require("./medicine.controller")
const PetRecordController = require('./pet-record.controller');
const BookingController = require('./booking.controller');
const MedicalController = require('./medical.controller');
const PetController = require('./pet.controller');
const ShoppingCartController = require('./shopping-cart.controller');
const NewController = require("./new.controller")
const PaymentController = require("./payment.controller");
const DashBoardController = require("./dashboard.controller")
const MessageController = require("./message.controller")
module.exports = {
    ProductController,
    CategoryController,
    ServiceController,
    AccountController,
    OTPController,
    PetRecordController,
    BookingController,
    MedicineController,
    MedicalController,
    PetController,
    ShoppingCartController,
    NewController,
    PaymentController,
    DashBoardController,
    MessageController
};
