
import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],

	setProducts: (products) => set({ products }),

	// Create a product
	createProduct: async (newProduct) => {
		if (
			!newProduct.name?.trim() ||
			!newProduct.description?.trim() ||
			!newProduct.image?.trim() ||
			newProduct.price === "" ||
			newProduct.price === null ||
			newProduct.price === undefined ||
			!Number.isFinite(Number(newProduct.price))
		) {
			return {
				success: false,
				message: "Please fill in all fields with valid values.",
			};
		}

		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: newProduct.name.trim(),
					price: Number(newProduct.price),
					description: newProduct.description.trim(),
					image: newProduct.image.trim(),
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				return {
					success: false,
					message: data.message || "Failed to create product.",
				};
			}

			set((state) => ({
				products: [...state.products, data.data],
			}));

			return {
				success: true,
				message: data.message || "Product created successfully.",
			};
		} catch (error) {
			console.error("Create product error:", error);

			return {
				success: false,
				message: "Unable to connect to the server.",
			};
		}
	},

	// Fetch all products
	fetchProducts: async () => {
		try {
			const res = await fetch("/api/products");
			const data = await res.json();

			if (!res.ok || !data.success) {
				return {
					success: false,
					message: data.message || "Failed to fetch products.",
				};
			}

			set({ products: data.data });

			return {
				success: true,
				message: data.message || "Products fetched successfully.",
			};
		} catch (error) {
			console.error("Fetch products error:", error);

			return {
				success: false,
				message: "Unable to connect to the server.",
			};
		}
	},

	// Delete a product
	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "DELETE",
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				return {
					success: false,
					message: data.message || "Failed to delete product.",
				};
			}

			set((state) => ({
				products: state.products.filter(
					(product) => product._id !== pid
				),
			}));

			return {
				success: true,
				message: data.message || "Product deleted successfully.",
			};
		} catch (error) {
			console.error("Delete product error:", error);

			return {
				success: false,
				message: "Unable to connect to the server.",
			};
		}
	},

	// Update a product
	updateProduct: async (pid, updatedProduct) => {
		if (
			!updatedProduct.name?.trim() ||
			!updatedProduct.description?.trim() ||
			!updatedProduct.image?.trim() ||
			updatedProduct.price === "" ||
			updatedProduct.price === null ||
			updatedProduct.price === undefined ||
			!Number.isFinite(Number(updatedProduct.price))
		) {
			return {
				success: false,
				message: "Please fill in all fields with valid values.",
			};
		}

		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: updatedProduct.name.trim(),
					price: Number(updatedProduct.price),
					description: updatedProduct.description.trim(),
					image: updatedProduct.image.trim(),
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				return {
					success: false,
					message: data.message || "Failed to update product.",
				};
			}

			set((state) => ({
				products: state.products.map((product) =>
					product._id === pid ? data.data : product
				),
			}));

			return {
				success: true,
				message: data.message || "Product updated successfully.",
			};
		} catch (error) {
			console.error("Update product error:", error);

			return {
				success: false,
				message: "Unable to connect to the server.",
			};
		}
	},
}));
