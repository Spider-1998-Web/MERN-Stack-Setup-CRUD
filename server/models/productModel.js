import mongoose from "mongoose";

const productSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
},{timestamps: true});

// Create a model from the schema
const ProductModel = mongoose.model("Product", productSchema);

// Export the model
export default ProductModel;