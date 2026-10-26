import mongoose from "mongoose";
import productModel from "../models/productModel.js";


// Get All Items in DB
export const getAllProducts = ("/api/products", async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, data: products, message: "Products fetched successfully" });
    }
    catch (error) {
        console.error(error.message);
        res.status(404).json({ success: false, message: "Server error", error: error.message });
    }

});

export const createProduct = ("/api/products", async (req, res) => {
    const product = req.body;

    if (!product.name || !product.price || !product.description || !product.image) {
        return res.status(404).json({ success: false, message: "All fields are required" });
    }

    const newProduct = new productModel(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct, message: "Product created successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }


});


export const updateProduct = ("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, image, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(id, { name, price, description, image }, { new: true });
        res.status(200).json({ success: true, data: updatedProduct, message: `Product with ID ${id} updated successfully` });
    } catch (error) {
        console.error(error.message);
        res.status(404).json({ success: false, message: "Server error", error: error.message });
    }
});


export const deleteProduct = ("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `Product with ID ${id} deleted successfully` });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ success: false, message: "Server error", error: error.message });
  }
});

