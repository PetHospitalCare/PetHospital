const ProductRouter = require('./product.route');
const ServiceRouter = require('./service.route');
const CategoryRouter = require('./category.route');
const AccountRouter = require('./account.route');
const MedicineRouter = require('./medicine.route')
const PetRecordRouter = require('./pet-record.route');
const BookingRouter = require('./booking.route');
const MedicalRoute = require('./medical.route');
const PetRouter = require('./pet.route');
const ShoppingCartRouter = require('./shopping-cart.route');
const NewRouter = require("./new.route")
const PaymentRouter = require('./payment.route');
const DashboardRouter = require('./dashboard.route');
const MessageRoute = require('./message.route');

module.exports = {
    ProductRouter,
    ServiceRouter,
    CategoryRouter,
    AccountRouter,
    PetRecordRouter,
    PetRouter,
    BookingRouter,
    MedicineRouter,
    ShoppingCartRouter,
    NewRouter,
    MedicalRoute,
    PaymentRouter,
    DashboardRouter,
    MessageRoute
};