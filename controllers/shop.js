const Product = require("../models/product");

//get all products
exports.getProducts = async (req, res, next) => {
  try {
    const product = await Product.findAll();
    res.render("shop/product-list", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

//get a single product
exports.getProduct = async (req, res, next) => {
  const prodId = +req.params.productId;
  try {
    const products = await Product.findAll({ where: { id: prodId } });

    res.render("shop/product-detail", {
      product: products[0],
      pageTitle: products[0].title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const { dataValues: product } = await Product.findByPk(prodId);
  //   res.render("shop/product-detail", {
  //     product: product,
  //     pageTitle: product.title,
  //     path: "/products",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
};

exports.getIndex = async (req, res, next) => {
  try {
    const product = await Product.findAll();
    res.render("shop/index", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const cartProducts = await cart.getProducts();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCardDeleteProduct = async (req, res, next) => {
  const prodId = +req.body.productId;
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const product = products[0];
    await product.cartItem.destroy();
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = +req.body.productId;
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    let newQuantity;
    if (product) {
      const oldQuantity = await product.cartItem.quantity;
      console.log(oldQuantity);
      newQuantity = oldQuantity + 1;
      await cart.addProduct(product, { through: { quantity: newQuantity } });
    } else {
      newQuantity = 1;
      product = await Product.findByPk(prodId);
      await cart.addProduct(product, { through: { quantity: newQuantity } });
    }
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.postOrder = async (req, res, next) => {
  const user = req.user;
  try {
    const cart = await user.getCart();
    const products = await cart.getProducts();
    const order = await user.createOrder();
    const result = await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );
    cart.setProducts(null);
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
