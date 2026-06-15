const categories = [

    "All",

    "Beauty",

    "Electronics",

    "Fashion",

    "Groceries",

    "Food",

    "Books",

    "Toys"

];

const categorySelect =
document.getElementById("categorySelect");

categories.forEach(category => {

    const option =
    document.createElement("option");

    option.value =
    category;

    option.textContent =
    category;

    categorySelect.appendChild(option);

});


function saveSearch(text){

    if(text==="") return;

    let history =

    JSON.parse(
        localStorage.getItem("history")
    ) || [];

    history.unshift(text);

    history = [...new Set(history)];

    history = history.slice(0,5);

    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );

}

function searchProducts(){

    const searchText =

    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const selectedCategory =
    categorySelect.value;

    const results =
    document.getElementById("results");

    results.innerHTML = "";

    const filteredProducts =

    products.filter(product => {

        const nameMatch =

        product.name
        .toLowerCase()
        .includes(searchText);

        const categoryMatch =

        selectedCategory === "All"

        ||

        product.category === selectedCategory;

        return nameMatch && categoryMatch;

    });

    if(filteredProducts.length === 0){

        results.innerHTML =

        "<h2>No products found</h2>";

        return;

    }

    filteredProducts.forEach(product => {

        let cheapest =

        product.platforms[0];

        product.platforms.forEach(platform => {

            if(platform.price < cheapest.price){

                cheapest = platform;

            }

        });

        const card =

        document.createElement("div");

        card.className = "card";

        card.onclick = () => {
            
            openProductModal(product);
        
        };

        card.innerHTML = `
        
        <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image">

        <h2>${product.name}</h2>

        <h4>${product.category}</h4>

        <p>

        Cheapest:

        ${cheapest.app}

        ₹${cheapest.price}

        </p>

        `;

        product.platforms.forEach(platform => {

            const div =

            document.createElement("div");

            div.className =

            platform.price === cheapest.price

            ?

            "platform best"

            :

            "platform";

            div.innerHTML =

            `
            <strong>

            ${platform.app}

            </strong>

            <p>

            ₹${platform.price}

            </p>

            <p>

            ${platform.offer}

            </p>
            `;

            card.appendChild(div);

        });

        results.appendChild(card);

    });

    if(searchText.trim() !== ""){

    saveSearch(searchText);

    loadSearchHistory();

}

}

function saveRecentlyViewed(product){

    let recent =

    JSON.parse(
        localStorage.getItem("recent")
    ) || [];

    recent =
    recent.filter(
        item => item.name !== product.name
    );

    recent.unshift(product);

    recent = recent.slice(0,5);

    localStorage.setItem(

        "recent",

        JSON.stringify(recent)

    );

}

function openProductModal(product){

    saveRecentlyViewed(product);

    loadRecentProducts();

    const modal =
    document.getElementById("productModal");

    const modalBody =
    document.getElementById("modalBody");

    let cheapest =
    product.platforms[0];

    product.platforms.forEach(platform => {

        if(platform.price < cheapest.price){

            cheapest = platform;

        }

    });

    let platformsHTML = `

<table class="price-table">

<tr>

<th>Platform</th>

<th>Price</th>

<th>Offer</th>

</tr>

`;

product.platforms.forEach(platform => {

    platformsHTML += `

    <tr class="${
        platform.price === cheapest.price
        ?
        "best-row"
        :
        ""
    }">

        <td>${platform.app}</td>

        <td>₹${platform.price}</td>

        <td>${platform.offer}</td>

    </tr>

    `;

});

platformsHTML += `</table>`;

    modalBody.innerHTML = `

    <img
    src="${product.image}"
    class="product-image">

    <h2>${product.name}</h2>

    <h3>${product.category}</h3>

    <p>

    Cheapest Deal:

    ${cheapest.app}

    ₹${cheapest.price}

    </p>

    <h3>Price Comparison</h3>

    ${platformsHTML}

`;

    modal.style.display = "block";

}

function closeModal(){

    document
    .getElementById("productModal")
    .style.display = "none";

}

function loadTrendingProducts() {

    const trendingContainer =
    document.getElementById("trendingProducts");

    trendingContainer.innerHTML = "";

    const trending = products.filter(product => product.trending);

    trending.forEach(product => {

        const card =
        document.createElement("div");

        card.className = "card";

        card.onclick = () => {
            
            openProductModal(product);
        };

        card.innerHTML = `

        <button
        class="wishlist-btn
        ${isWishlisted(product.name) ? 'wishlist-active' : ''}"
        onclick="toggleWishlist(event,'${product.name}')">
        ❤
        </button>

            <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image">

            <h3>${product.name}</h3>

            <p>${product.category}</p>

        `;

        trendingContainer.appendChild(card);

    });

}

loadTrendingProducts();

window.onclick = function(event){

    const modal =
    document.getElementById("productModal");

    if(event.target === modal){

        closeModal();

    }

}

function isWishlisted(productName){

    let wishlist =

    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    return wishlist.includes(productName);
}

function toggleWishlist(event, productName){

    event.stopPropagation();

    let wishlist =

    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    if(wishlist.includes(productName)){

        wishlist =
        wishlist.filter(
            item => item !== productName
        );

    }

    else{

        wishlist.push(productName);

    }

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    loadTrendingProducts();

    loadWishlistProducts();

}

function loadRecentProducts(){

    const container =

    document.getElementById(
        "recentProducts"
    );

    const recent =

    JSON.parse(
        localStorage.getItem("recent")
    ) || [];

    container.innerHTML = "";

    recent.forEach(product=>{

        const card =

        document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <img
        src="${product.image}"
        class="product-image">

        <h3>${product.name}</h3>

        `;

        card.onclick = () =>

        openProductModal(product);

        container.appendChild(card);

    });

}

function loadSearchHistory(){

    console.log("loadSearchHistory running");

    const list =

    document.getElementById(
        "searchHistory"
    );

    const history =

    JSON.parse(
        localStorage.getItem("history")
    ) || [];

    list.innerHTML = "";

    history.forEach(item=>{

        const li =
        document.createElement("li");

        li.textContent = item;

        list.appendChild(li);

    });

}

function loadWishlistProducts(){

    const container =

    document.getElementById(
        "wishlistProducts"
    );

    container.innerHTML = "";

    let wishlist =

    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    const wishlistProducts =

    products.filter(product =>

        wishlist.includes(product.name)

    );

    wishlistProducts.forEach(product => {

        const card =

        document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img
            src="${product.image}"
            class="product-image">

            <h3>${product.name}</h3>

            <p>${product.category}</p>

        `;

        card.onclick = () =>

        openProductModal(product);

        container.appendChild(card);

    });

}

loadTrendingProducts();

loadWishlistProducts();

loadRecentProducts();

loadSearchHistory();