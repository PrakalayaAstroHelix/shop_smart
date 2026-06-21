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

        results.appendChild(
            createProductCard(product)
        );

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
    <img src="${product.image}" class="product-image">

    <h2>${product.name}</h2>

    <h3>${product.category}</h3>

    <p>
    Cheapest Deal:
    ${cheapest.app}
    ₹${cheapest.price}
    </p>

    <button
    onclick="addToCart('${product.name}')">

    🛒 Add To Cart

    </button>

    <button
    onclick="buyNow('${product.name}')">

    ⚡ Buy Now

    </button>

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
       createProductCard(product);
       
       trendingContainer.appendChild(card);

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

    if(!container){

        return;

    }

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

    return;

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

const themeButton =

document.getElementById(
    "themeToggle"
);

themeButton.onclick = () => {

    document.body.classList.toggle(
        "dark-mode"
    );

    const darkMode =

    document.body.classList.contains(
        "dark-mode"
    );

    localStorage.setItem(

        "theme",

        darkMode ? "dark" : "light"

    );

};

if(

    localStorage.getItem("theme")

    ===

    "dark"

){

    document.body.classList.add(
        "dark-mode"
    );

}

function openSidebar(){

    document
    .getElementById("sidebar")
    .style.width = "350px";

}

function closeSidebar(){

    document
    .getElementById("sidebar")
    .style.width = "0";

}


function showWishlistPage(){

    closeSidebar();

    document.getElementById(
        "homePage"
    ).style.display = "none";

    const page =
    document.getElementById("menuPage");

    page.style.display = "block";

    let wishlist =
    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    page.innerHTML =
    "<h1>❤️ Wishlist</h1>";

    wishlist.forEach(name => {

        const product =
        products.find(
            p => p.name === name
        );

        if(product){
            
            page.appendChild(
            createProductCard(product)
        );
    }
});

}

function showRecentPage(){

    closeSidebar();

    document.getElementById(
        "homePage"
    ).style.display = "none";

    const page =
    document.getElementById("menuPage");

    page.style.display = "block";

    page.innerHTML =
    "<h1>🕒 Recently Viewed</h1>";

    const recent =
    JSON.parse(
        localStorage.getItem("recent")
    ) || [];

    recent.forEach(product => {

    page.appendChild(
        createProductCard(product)
    );

});

}

function showHistoryPage(){

    closeSidebar();

    document.getElementById(
        "homePage"
    ).style.display = "none";

    const page =
    document.getElementById("menuPage");

    page.style.display = "block";

    page.innerHTML =
    "<h1>🔍 Search History</h1>";

    const history =
    JSON.parse(
        localStorage.getItem("history")
    ) || [];

    history.forEach(item => {

        page.innerHTML += `

        <div class="card">

            <h3>${item}</h3>

        </div>

        `;

    });

}

function showHomePage(){

    closeSidebar();

    document.getElementById(
        "menuPage"
    ).style.display = "none";

    document.getElementById(
        "homePage"
    ).style.display = "block";

}

function showProfile(){

    closeSidebar();

    document.getElementById(
        "homePage"
    ).style.display = "none";

    const page =
    document.getElementById("menuPage");

    page.style.display = "block";

    const username =
    localStorage.getItem("username")
    || "Guest User";

    page.innerHTML = `

        <h1>👤 Profile</h1>

        <div class="card">

            <h2>${username}</h2>

            <p>Member of ShopSmart</p>

            <p>
            Wishlist saved locally
            </p>

        </div>

    `;
}

function showLogin(){

    let username = prompt(
        "Enter username"
    );

    if(username){

        localStorage.setItem(
            "username",
            username
        );

        alert(
            "Welcome " + username
        );

    }

}

function selectPlatform(productName){

    const product =
    products.find(
        p => p.name === productName
    );

    const container =
    document.getElementById(
        "platformButtons"
    );

    container.innerHTML = "";

    document.getElementById(
        "platformModal"
    ).style.display = "block";

    product.platforms.forEach(platform => {

        const btn =
        document.createElement("button");

        btn.textContent =
        platform.app;

        btn.onclick = () => {

            window.selectedPlatform =
            platform.app;

            document.getElementById(
                "platformModal"
            ).style.display = "none";

        };

        container.appendChild(btn);

    });

}

function addToCart(productName){

    const platformName =
    selectPlatform(productName);

    if(!platformName) return;

    const product =
    products.find(
        p => p.name === productName
    );

    const platform =
    product.platforms.find(
        p =>
            p.app.toLowerCase() ===
        platformName.toLowerCase()
    
    );

    if(!platform){

        alert("Website not found");

        return;

    }

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart.push({

        productName:

        product.name,

        image:

        product.image,

        platform:

        platform.app,

        price:

        platform.price

    });

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert(

        product.name +

        " added to " +

        platform.app

    );

}

function buyNow(productName){

    const platformName =
    selectPlatform(productName);

    if(!platformName) return;

    alert(

        "Redirecting to " +

        platformName +

        " checkout"

    );

}


function openCartProduct(item){

    const modal =
    document.getElementById(
        "productModal"
    );

    const modalBody =
    document.getElementById(
        "modalBody"
    );

    modalBody.innerHTML = `

        <img
        src="${item.image}"
        class="product-image">

        <h2>

        ${item.productName}

        </h2>

        <p>

        Platform:
        ${item.platform}

        </p>

        <p>

        ₹${item.price}

        </p>

        <button>

        ⚡ Buy Now

        </button>

    `;

    modal.style.display =
    "block";

}

function showCartPage(){

    closeSidebar();

    document.getElementById(
        "homePage"
    ).style.display = "none";

    const page =
    document.getElementById("menuPage");

    page.style.display = "block";

    page.innerHTML =
    "<h1>🛒 Shopping Cart</h1>";

    const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const grouped = {};

    cart.forEach(item => {

        if(!grouped[item.platform]){

            grouped[item.platform] = [];

        }

        grouped[item.platform].push(item);

    });

    for(let website in grouped){

        page.innerHTML +=
        `<h2>${website}</h2>`;

        grouped[website].forEach(item => {

            page.innerHTML += `

            <div
            class="card"
            onclick="openCartItem('${item.productName}','${item.platform}')">

                <img
                src="${item.image}"
                class="product-image">

                <h3>${item.productName}</h3>

                <p>₹${item.price}</p>

            </div>

            `;

        });
    }
}

function openCartItem(productName, platform){

    const product =
    products.find(
        p => p.name === productName
    );

    const modal =
    document.getElementById(
        "productModal"
    );

    const modalBody =
    document.getElementById(
        "modalBody"
    );

    modalBody.innerHTML = `

        <img
        src="${product.image}"
        class="product-image">

        <h2>${product.name}</h2>

        <h3>${platform}</h3>

        <button
        onclick="removeFromCart(
        '${product.name}',
        '${platform}'
        )">

        ❌ Remove From Cart

        </button>

        <button
        onclick="changeCart(
        '${product.name}',
        '${platform}'
        )">

        🔄 Change Cart

        </button>

        <button
        onclick="buyDirect(
        '${product.name}',
        '${platform}'
        )">

        ⚡ Buy

        </button>

    `;

    modal.style.display =
    "block";

}

function removeFromCart(
    productName,
    platform
){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart = cart.filter(item =>

        !(

            item.productName === productName &&

            item.platform === platform

        )

    );

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    closeModal();

    showCartPage();

}

function changeCart(
    productName,
    oldPlatform
){

    const product =
    products.find(
        p => p.name === productName
    );

    let options = product.platforms
    .filter(
        p => p.app !== oldPlatform
    )
    .map(
        p => p.app
    );

    let newPlatform =
    options[0];

    if(options.length > 1){

        newPlatform =
        prompt(
            "Choose:\n\n" +
            options.join("\n")
        );

    }

    if(!newPlatform) return;

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart.forEach(item => {

        if(
            item.productName === productName &&
            item.platform === oldPlatform
        ){

            const target =
            product.platforms.find(
                p =>
                p.app.toLowerCase()
                ===
                newPlatform.toLowerCase()
            );

            if(target){

                item.platform =
                target.app;

                item.price =
                target.price;

            }

        }

    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    closeModal();

    showCartPage();

}

function buyDirect(
    productName,
    platform
){

    alert(

        "Proceeding to checkout on " +

        platform

    );

}

function createProductCard(product){

    const card =
    document.createElement("div");

    card.className = "card";

    card.onclick = () =>
    openProductModal(product);

    card.innerHTML = `
        <img src="${product.image}"
        class="product-image">

        <h3>${product.name}</h3>

        <p>${product.category}</p>
    `;

    return card;
}

function closePlatformModal(){

    document.getElementById(
        "platformModal"
    ).style.display = "none";

}

window.addEventListener("click", function(event){

    const platformModal =
    document.getElementById(
        "platformModal"
    );

    if(event.target === platformModal){

        closePlatformModal();

    }

});

loadTrendingProducts();

//loadWishlistProducts();

//loadRecentProducts();

//loadSearchHistory();