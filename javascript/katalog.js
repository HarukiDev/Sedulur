const products = [
	{
		image: "img/Testimonial/Aesan_Paksangko_(_Pakaian_Tradisional_Palembang).jpg",
		brand: "Aesan Paksangko",
		name: "Aesan Paksangko",
		price: "Rp 75.000",
		originalPrice: "Rp 100.000",
		category: "makanan",
		phone: "6281273465572",
	},
	{
		image: "img/Testimonial/Aneka_Kue_di_Toko_Kue_Harum.jpg",
		brand: "Aneka Kue Harum",
		name: "Aneka Kue",
		price: "Rp 50.000",
		originalPrice: "Rp 70.000",
		category: "makanan",
		phone: "6281273465572",
	},
	{
		image: "img/Testimonial/Berugo.jpg",
		brand: "Berugo Samat",
		name: "Berugo",
		price: "Rp 60.000",
		originalPrice: "Rp 80.000",
		category: "makanan",
		phone: "6281273465572",
	},
	{
		image: "img/Testimonial/Lenggang_Goreng_dengan_Cuko.jpg",
		brand: "Lenggang Bambang",
		name: "Lenggang Goreng",
		price: "Rp 45.000",
		originalPrice: "Rp 65.000",
		category: "makanan",
		phone: "6281273465572",
	},
	{
		image: "img/Testimonial/Pindang_Ikan_Tembakang.jpg",
		brand: "Nur Hidayah",
		name: "Pindang Ikan",
		price: "Rp 90.000",
		originalPrice: "Rp 120.000",
		category: "makanan",
		phone: "6281273465572",
	},
	{
		image: "img/Testimonial/Soengkit_met_nampan_perak-patroon_afkomstig_uit_Palembang,_KITLV_5587.tiff.jpg",
		brand: "Soengket Palembang",
		name: "Soenget",
		price: "Rp 55.000",
		originalPrice: "Rp 75.000",
		category: "oleh-oleh",
		phone: "6281273465572",
	},
];


const catalog = document.getElementById("catalog");
let searchQuery = "";
let selectedCategory = "all";

function renderCatalog(productsToRender) {
	catalog.innerHTML = "";
	productsToRender.forEach((product) => {
		const card = document.createElement("div");
		card.className = "card";

		const message = encodeURIComponent(`Halo! Saya tertarik membeli produk *${product.name}* dengan harga ${product.price}`);
		const waLink = `https://wa.me/${product.phone}?text=${message}`;

		card.innerHTML = `
	<a href="${waLink}" target="_blank" class="wa-button">
		<img src="${product.image}" alt="${product.name}">
		<div class="card-content">
			<span class="brand">${product.brand}</span>
			<p class="product-name">${product.name}</p>
			<div class="price-container">
				<p class="price">${product.price}</p>
				<p class="original-price">${product.originalPrice}</p>
			</div>
		</div>
	</a>
`;
		catalog.appendChild(card);
	});
}

function filterProducts() {
	return products.filter((product) => {
		const matchesSearch = product.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});
}

renderCatalog(products);

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

searchInput.addEventListener("input", (e) => {
	searchQuery = e.target.value;
	renderCatalog(filterProducts());
});

categoryFilter.addEventListener("change", (e) => {
	selectedCategory = e.target.value;
	renderCatalog(filterProducts());
});
