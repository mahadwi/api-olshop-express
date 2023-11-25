const { getCartByUserId, deleteCartProduct, createCartProduct } = require("../services/cart.service");
const CustomAPIError = require("../middlewares/custom-error");

const showCart = async (req, res) => {
  console.log(req.user.id, "<<< user id");

  const userCart = await getCartByUserId(+req.user.id);
  return res.json({
    status: "success",
    message: "This is the Cart",
    data: userCart,
  });
};

const deleteCart = async (req, res) => {
  const userId = req.user.id; // Assuming userId is obtained from authentication middleware
  const productId = req.body.productId; // Assuming productId is passed in request body

  try {
    const result = await deleteCartProduct(userId, productId);
    res.json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id; // Mendapatkan user ID dari request

    const addedProduct = await createCartProduct(product_id, userId, quantity);

    res.status(200).json({ message: "Produk berhasil ditambahkan ke dalam keranjang", addedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { showCart, deleteCart, addToCart, deleteCart };