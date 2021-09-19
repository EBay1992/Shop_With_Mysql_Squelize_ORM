const path = require("path");

const express = require("express");

const sequelize = require("./util/database");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const startServer = async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });

    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        username: "Ehsan",
        email: "ehsan@Test.com",
      });
      await user.createCart();
    }
    // console.log(user);
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
};

startServer();
