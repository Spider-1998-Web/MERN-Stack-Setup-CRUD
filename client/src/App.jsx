
import { useState } from "react";
import { useProductStore } from "./stores/productStore";
import "./App.css";

const emptyForm = {
	name: "",
	price: "",
	description: "",
	image: "",
};

function App() {
	const {
		products,
		fetchProducts,
		createProduct,
		updateProduct,
		deleteProduct,
	} = useProductStore();

	const [form, setForm] = useState(emptyForm);
	const [selectedId, setSelectedId] = useState("");
	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const showResponse = (operation, result, extra = {}) => {
		setResponse({
			operation,
			...result,
			...extra,
		});
	};

	const handleFetch = async () => {
		setLoading(true);

		try {
			const result = await fetchProducts();
			showResponse("GET /api/products", result, {
				data: useProductStore.getState().products,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await createProduct({
				...form,
				price: Number(form.price),
			});

			showResponse("POST /api/products", result);

			if (result.success) {
				setForm(emptyForm);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSelectProduct = (e) => {
		const id = e.target.value;
		setSelectedId(id);

		const product = products.find((item) => item._id === id);

		if (product) {
			setForm({
				name: product.name ?? "",
				price: String(product.price ?? ""),
				description: product.description ?? "",
				image: product.image ?? "",
			});
		} else {
			setForm(emptyForm);
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		if (!selectedId) {
			showResponse("PUT /api/products/:id", {
				success: false,
				message: "Select a product first.",
			});
			return;
		}

		setLoading(true);

		try {
			const result = await updateProduct(selectedId, {
				...form,
				price: Number(form.price),
			});

			showResponse(`PUT /api/products/${selectedId}`, result);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedId) {
			showResponse("DELETE /api/products/:id", {
				success: false,
				message: "Select a product first.",
			});
			return;
		}

		if (!window.confirm("Are you sure you want to delete this product?")) {
			return;
		}

		setLoading(true);

		try {
			const id = selectedId;
			const result = await deleteProduct(id);

			showResponse(`DELETE /api/products/${id}`, result);

			if (result.success) {
				setSelectedId("");
				setForm(emptyForm);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="api-dashboard">
			<header className="dashboard-header">
				<div>
					<h1>Product API Tester</h1>
					<p>Test your Express and MongoDB CRUD operations.</p>
				</div>

				<span className="api-label">REST API</span>
			</header>

			<section className="panel">
				<h2>1. Fetch products</h2>

				<button
					className="btn btn-get"
					onClick={handleFetch}
					disabled={loading}
				>
					{loading ? "Processing..." : "GET — Fetch Products"}
				</button>

				<p className="endpoint">
					GET <code>/api/products</code>
				</p>

				<div className="product-list">
					<h3>Products in Zustand state ({products.length})</h3>

					{products.length === 0 ? (
						<p>No products loaded. Click Fetch Products.</p>
					) : (
						products.map((product) => (
							<div className="product-item" key={product._id}>
								<div>
									<strong>{product.name}</strong>
									<p>{product.description}</p>
									<small>ID: {product._id}</small>
								</div>

								<strong>
									{Number(product.price).toFixed(2)}
								</strong>
							</div>
						))
					)}
				</div>
			</section>

			<section className="panel">
				<h2>2. Create a product</h2>

				<p className="endpoint">
					POST <code>/api/products</code>
				</p>

				<form onSubmit={handleCreate} className="product-form">
					<label>
						Product name
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Enter product name"
							required
						/>
					</label>

					<label>
						Price
						<input
							name="price"
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={handleChange}
							placeholder="Enter price"
							required
						/>
					</label>

					<label>
						Description
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							placeholder="Enter product description"
							required
						/>
					</label>

					<label>
						Image URL
						<input
							name="image"
							type="url"
							value={form.image}
							onChange={handleChange}
							placeholder="https://example.com/image.jpg"
							required
						/>
					</label>

					<button
						className="btn btn-post"
						type="submit"
						disabled={loading}
					>
						POST — Create Product
					</button>
				</form>
			</section>

			<section className="panel">
				<h2>3. Update or delete a product</h2>

				<label>
					Select product
					<select value={selectedId} onChange={handleSelectProduct}>
						<option value="">Choose a product...</option>
						{products.map((product) => (
							<option key={product._id} value={product._id}>
								{product.name} — {product._id}
							</option>
						))}
					</select>
				</label>

				{selectedId && (
					<p className="selected-id">
						Product ID: <code>{selectedId}</code>
					</p>
				)}

				<form onSubmit={handleUpdate} className="product-form">
					<label>
						Product name
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Enter product name"
							required
						/>
					</label>

					<label>
						Price
						<input
							name="price"
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={handleChange}
							placeholder="Enter price"
							required
						/>
					</label>

					<label>
						Description
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							placeholder="Enter product description"
							required
						/>
					</label>

					<label>
						Image URL
						<input
							name="image"
							type="url"
							value={form.image}
							onChange={handleChange}
							placeholder="https://example.com/image.jpg"
							required
						/>
					</label>

					<div className="button-row">
						<button
							className="btn btn-put"
							type="submit"
							disabled={loading || !selectedId}
						>
							PUT — Update Product
						</button>

						<button
							className="btn btn-delete"
							type="button"
							onClick={handleDelete}
							disabled={loading || !selectedId}
						>
							DELETE — Delete Product
						</button>
					</div>
				</form>
			</section>

			<section className="panel response-panel">
				<div className="response-heading">
					<h2>API response</h2>
					<button
						className="btn btn-secondary"
						onClick={() => setResponse(null)}
					>
						Clear
					</button>
				</div>

				{response ? (
					<>
						<p className="response-operation">
							{response.operation}
						</p>

						<pre>
							{JSON.stringify(response, null, 2)}
						</pre>
					</>
				) : (
					<p>
						No response yet. Run an operation to see its result
						here.
					</p>
				)}
			</section>
		</main>
	);
}

export default App;
