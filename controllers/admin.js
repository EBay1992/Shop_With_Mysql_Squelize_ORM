const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;

  try {
    req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.body.id;
  try {
    await Product.destroy({ where: { id: id } });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

  // await Cart.deleteProduct(id, product.price);
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = +req.params.productId;
  try {
    const products = await req.user.getProducts({ where: { id: prodId } });
    const product = products[0];
    // const product = await Product.findByPk(prodId);
    if (!products) {
      res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: Boolean(editMode),
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;
  const id = req.body.id;

  try {
    const product = await Product.findByPk(id);
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    const result = await product.save();
    console.log("updated", result);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  const products = await req.user.getProducts();
  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};
