
(function () {
  "use strict";

  const state = {
    products: [],
    favorites: new Set(),
  };

  const CONSTANTS = {
    storiesLocation: "ins-preview-wrapper",
    carouselTitle: "Beğenebileceğinizi Düşündüklerimiz",
    wrongPageMessage: "wrong page.",
    productsApiUrl:
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    localStorageKey: "favoriteProducts",
    productsLocalStorageKey: "cachedProducts",
    itemSvg:{
        starSvg :
            ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"> <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon> </svg>`,
        favoriteIcon: 
            `<svg viewBox="0 0 24 24" fill="none" stroke="#f28e00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>`,
        
            },


    images:{
        noImg:"https://via.placeholder.com/200x200.png?text=Resim+Yok",

    },

    logs:{
        addCart:"id'li ürün sepete eklendi",
        writeFavoriteProductToLocalError:"Favoriler yerel depolamaya kaydedilirken hata oluştu",
        readFavoriteProductToLocalError:"Favoriler yerel depolamaya kaydedilirken hata oluştu",
        readProductsToLocalError:"Ürünler yerel depolamadan okunurken hata oluştu",
        writeProductsToLocalError:"Ürünler yerel depolamaya kaydedilirken hata oluştu",
        existCarouselMessage:"Karusel zaten mevcut.",
        httpErrorCodeMessage:"HTTP Hata kodu",
        readProductFromAPIErrorMessage:"Ürünler API'den getirilirken hata oluştu",

    },

    commentCount:125
  };

  const styles = `
    .product-carousel {
        margin: 20px auto;
        max-width: 1320px;
        padding: 20px;
        border-radius: 8px;
        font-family: sans-serif;
        position: relative;
    }

    .product-carousel-title-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fef6eb;
        padding: 25px 67px;
        border-top-left-radius: 35px;
        border-top-right-radius: 35px;
        font-family: Quicksand-Bold;
        font-weight: 700;
    }

    .product-carousel-title {
        font-family: 'Quicksand-Bold', sans-serif;
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.11;
        color: #f28e00;
        margin: 0;
        text-align: center;
    }

    .product-list-container {
        position: relative;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
    }

    .carousel-arrow {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #fef6eb;
       
    }

     .carousel-arrow.left {
        background-image: url('assets/svg/prev.svg');
        background-repeat: no-repeat;
        background-position: center;
        left: -65px;
    }

    .carousel-arrow.right {
        background-image: url('assets/svg/next.svg');
        background-repeat: no-repeat;
        background-position: center;
        right: -65px;
    }

    .carousel-arrow:hover {
        background-color: #fff;
        border-color: #f28e00;
        border: 1px solid #f28e00;
    }


    .product-list {
        display: flex;
        overflow-x: auto;
        gap: 20px;
        padding: 20px 0;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
         -ms-overflow-style: none;
        scrollbar-width: none;
    }


    .product-item-div {
        flex: 0 0 auto; 
        width: calc((100% / 5) - 16px); 
        box-sizing: border-box;
    }  

    .product-item-carousel{
        z-index: 1;
        display: block;
        width: 100%;
        font-family: Poppins, "cursive";
        font-size: 12px;
        padding: 5px;
        color: #7d7d7d;
        margin: 0 0 20px 0px;
        border: 1px solid #ededed;
        border-radius: 10px;
        position: relative;
        text-decoration: none;
        background-color: #fff;
        min-height:520px
    }

    .product-item-carousel:hover{
        color: #7d7d7d;
    }
        
    .product-image {
        width: 100%; 
        height: auto; 
        max-width: 100%; 
        min-height: 240px; 
        object-fit: contain; 
    }



    .product-item-content-div{
        padding: 0 17px 13px 17px;
    }

    .product_item_content{
        min-height: 55px;
        margin: 10px 0;
        text-overflow: ellipsis;
        font-family: sans-serif;
    }

    .product-item-brand {
        font-weight: bold;
    
    }

    .product_price{
        position: relative;
        flex-direction: column;
         margin: 20px 0;
        height: 60px;
        display: flex;
        justify-content: flex-start;

    }
    .product_item_new-price{
        display: block;
        width: 100%;
        font-size: 2.2rem;
        font-weight: 600;
    
    }

    .product-item_old_price{
        font-size: 1.4rem;
        font-weight: 500;
        text-decoration: line-through;
    }

    .product-discount-percentage {
        border: 1px solid green;
        color: white;
        background-color: green;
        display: inline-block;
        width: 55px;
        height: auto;
        text-align: center;
        border-radius: 5px;
        margin-left: 5px;
        padding: 2px 5px; 
        font-size: 12px; 
    }

    .star-rating {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: 5px;
    }

    .star-rating svg {
        color: #f28e00; 
        fill: #f28e00; 
        margin-right:5px
    }
    
    .heart {
        position: absolute;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px 0 #00000024;
        width: 50px;
        height: 50px;
        right: 15px;
        top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .heart  svg {
        width: 25px;
        height: 25px;
    }

     .heart.is-favorite svg  {
        fill: #f28e00;
        stroke: #f28e00;
    }
    
    .product-btn{
        width: 100%;
        padding: 15px 20px;
        border-radius: 37.5px;
        background-color: #fff7ec;
        color: #f28e00;
        font-family: Poppins, "cursive";
        font-size: 1.4rem;
        font-weight: 700;
        margin-top: 25px
        text-transform: var(--cx-text-transform);
        line-height: 1.34;
        height: 48px;
        max-height: 48px;
        min-width: 48px;
        align-items: center;
        justify-content: center;
        display: flex

    }

    .product-btn:hover {
        background-color: #f28e00;
        color: #fff;
    } 


    @media (max-width: 1580px) {
        .product-carousel {
            max-width: 1296px;
           
        }
            
      
    }

    
    @media (max-width: 1480px) {
        .product-carousel {
            max-width: 1180px;
           
        }
              .product-item-div {
            width: calc((100% / 4) - 14px); /* 3 ürün + aralık */
        }
      
    }

    @media (max-width: 1280px) {
        .product-carousel {
            max-width: 960px;
        }
            .product-item-div {
            width: calc((100% / 3) - 14px); /* 3 ürün + aralık */
        }
       
    }

    @media (max-width: 992px) {
        .product-carousel {
            max-width: 720px;
        }
          .product-item-div {
            width: calc((100% / 2) - 14px); /* 3 ürün + aralık */
        }
    }
    
    @media (max-width: 768px) {
        .product-carousel {
            max-width: 540px;
            padding: 10px;
        }
              .product-item-div {
            width: calc((100% / 2) - 10px); /* 2 ürün + aralık */
        }
       
        .product-list {
            gap: 10px;
        }
    }
    
    @media (max-width: 576px) {
        .product-carousel {
            max-width: 100vw;
            padding-left: 15px;
            padding-right: 15px;
        }
    
        .product-carousel-title {
            font-size: 2rem;
        }
    }
    `;

  const createEl = (tag, attributes = {}, children = []) => {
    const el = document.createElement(tag);
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  };

  const createStars = (node, count) => {

    const starRatingDiv = createEl("div", { class: "star-rating" });
    const commentsCountLabel = createEl( "span",{}, [`( ${CONSTANTS?.commentCount})`]
);
    

    for (let i = 0; i < count; i++) {
      const starEl = createEl("span");
      starEl.innerHTML = CONSTANTS.itemSvg.starSvg;
      starRatingDiv.appendChild(starEl);
    }

    starRatingDiv.appendChild(commentsCountLabel);

    node.appendChild(starRatingDiv);
  };

  const crateFavIcon = (node, productId) => {
    const isFavorite = state.favorites.has(String(productId));

    const favoriteIcon = createEl("div", {
      class: `heart ${isFavorite ? "is-favorite":""}`,
      "data-product-id": productId,
    });

    const svgIcon =CONSTANTS.itemSvg.favoriteIcon;
    favoriteIcon.innerHTML = svgIcon;
    node.appendChild(favoriteIcon);
  };


  const createBadge = (node, productId) => {
    const bestSellerIds = new Set([3, 5, 8]);

    if (bestSellerIds.has(productId)) {
      node.appendChild(createEl("img", { src: "assets/images/cok-satan.png" }));
    }
  };


  const createPriceSection = (product) => {
    const pricesChildren = [
      createEl("span", { class: "product_item_new-price" }, [
        `${product.price} TL`,
      ]),
    ];

    if (product.price !== product.original_price && product.price < product.original_price) {
      const oldPriceContainer = createEl("div");

      const oldPriceSpan = createEl(
        "span",
        { class: "product-item_old_price" },
        [`${product.original_price} TL`]
      );
      oldPriceContainer.appendChild(oldPriceSpan);

      const discountPercentage = Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      );
      const discountPercentageSpan = createEl(
        "span",
        { class: "product-discount-percentage" },
        [`%${discountPercentage}`]
      );
      oldPriceContainer.appendChild(discountPercentageSpan);

      pricesChildren.push(oldPriceContainer);
    }

    const productItemPrice = createEl("div", {
      class: "product_price",
    });

    pricesChildren.forEach((child) => productItemPrice.appendChild(child));

    return productItemPrice;
  };






  const buildProductCard = (product) => {
    const productItemDiv = createEl("div", { class: "product-item-div" });
    const productItem = createEl("a", { class: "product-item-carousel", href: product.url, "data-product-id": product.id,});
   
    //product image
    const imageUrl =product.img || CONSTANTS.images.noImg;
    const image = createEl("img", { class: "product-image", src: imageUrl, alt: product.title,});

    // product content
    const productItemContentDiv = createEl("div", {class: "product-item-content-div    ",});
    const productBrand = createEl("span", { class: "product-item-brand" }, [  product.brand,]);
    const productName = createEl("span", { class: "product-item-name" }, [ ` - ${product.name}`,]);
    const productItemContent = createEl("div", {  class: "product_item_content", });
    
    //product price
    const priceSection = createPriceSection(product);

    productItemContent.appendChild(productBrand);
    productItemContent.appendChild(productName);

    productItemContentDiv.appendChild(productItemContent);
    productItemContentDiv.appendChild(priceSection);

   // product-button
    const addButton = createEl( "button", { id: product.id, class: "product-btn" }, ["Sepete Ekle"]);
    addButton.addEventListener("click", (event) => {
      event.preventDefault();
      console.log(`${product.id} ${CONSTANTS.logs.addCart}`);
    });



    // product badges
    const badgeDiv = createEl("div", { class: "product-item__multiple-badge" });
    createBadge(badgeDiv, product.id);

    // comment -starts
    createStars(productItemContentDiv, 5);


    // add all child to parent node
    productItem.appendChild(image);
    productItem.appendChild(productItemContentDiv);
    crateFavIcon(productItem, product.id);

    productItemDiv.appendChild(productItem);
    productItem.appendChild(addButton);
    productItem.appendChild(badgeDiv);

    return productItemDiv;
  };



  const buildCarousel = (products) => {

    const productCarousel = createEl("div", { class: "product-carousel" });
    
    // Carousel title
    const titleDiv = createEl("div", { class: "product-carousel-title-div" });
    const title = createEl("h2", { class: "product-carousel-title" }, [CONSTANTS.carouselTitle]);
    titleDiv.appendChild(title);

    // Product list
    const productListContainer = createEl("div", {class: "product-list-container"});
    const productList = createEl("div", { class: "product-list" });

    products.forEach((product) => {
      productList.appendChild(buildProductCard(product));
    });

    const leftArrow = createEl("div", { class: "carousel-arrow left" });
    const rightArrow = createEl("div", { class: "carousel-arrow right" });

    productListContainer.appendChild(leftArrow);
    productListContainer.appendChild(productList);
    productListContainer.appendChild(rightArrow);

    productCarousel.appendChild(titleDiv);
    productCarousel.appendChild(productListContainer);

    return productCarousel;
  };


  const saveFavoritesToLocalStorage = () => {

    try {
      localStorage.setItem(
        CONSTANTS.localStorageKey,
        JSON.stringify(Array.from(state.favorites))
      );
    } catch (error) {

      console.error(CONSTANTS.logs.writeFavoriteProductToLocalError,error);
    }
  };

  const getFavoritesFromLocalStorage = () => {
    try {
      const favorites = localStorage.getItem(CONSTANTS.localStorageKey);
      return favorites ? new Set(JSON.parse(favorites)) : new Set();
    } catch (error) {
      console.error(CONSTANTS.logs.readFavoriteProductToLocalError, error);
      return new Set();
    }
  };

  const saveProductsToLocalStorage = (products) => {
    try {
      localStorage.setItem(
        CONSTANTS.productsLocalStorageKey,
        JSON.stringify(products)
      );
    } catch (error) {
      console.error(CONSTANTS.logs.writeProductsToLocalError, error );
    }
  };

  const getProductsFromLocalStorage = () => {
    try {
      const products = localStorage.getItem(CONSTANTS.productsLocalStorageKey);
      return products ? JSON.parse(products) : null;
    } catch (error) {

      console.error(CONSTANTS.logs.readProductsToLocalError, error);
      return null;
    }
  };

const attachEventListeners = () => {
    const carouselEl = document.querySelector(".product-carousel");
    if (!carouselEl) return;
    
    const productList = carouselEl.querySelector(".product-list");

    const leftArrow = carouselEl.querySelector(".carousel-arrow.left");
    const rightArrow = carouselEl.querySelector(".carousel-arrow.right");

    if (leftArrow && productList) {
        leftArrow.addEventListener("click", () => {
            const productItem = carouselEl.querySelector(".product-item-div");
            if (!productItem) return;
            const itemWidth = productItem.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(productList).gap) || 20;
            const scrollAmount = itemWidth + gap;

            productList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
    }

    if (rightArrow && productList) {
        rightArrow.addEventListener("click", () => {
            const productItem = carouselEl.querySelector(".product-item-div");
            if (!productItem) return;
            const itemWidth = productItem.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(productList).gap) || 20;
            const scrollAmount = itemWidth + gap;

            const currentScrollLeft = productList.scrollLeft;
            const scrollableWidth = productList.scrollWidth - productList.clientWidth;
            
            if (currentScrollLeft + scrollAmount >= scrollableWidth) {
                productList.scrollTo({ left: scrollableWidth, behavior: "smooth" });
            } else {
                productList.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        });
    }

    carouselEl.addEventListener("click", (event) => {
        const target = event.target;
        
        const favoriteIcon = target.closest(".heart");

        if (favoriteIcon) {
            event.preventDefault(); 
            const productId = favoriteIcon.getAttribute("data-product-id");

            if (state.favorites.has(productId)) {
                state.favorites.delete(productId);
                favoriteIcon.classList.remove("is-favorite");
            } else {
                state.favorites.add(productId);
                favoriteIcon.classList.add("is-favorite");
            }
            saveFavoritesToLocalStorage();
        }
    });
};

  const init = async () => {

    const existingCarousel = document.querySelector(".product-carousel");

    if (existingCarousel) {
        console.log(CONSTANTS.logs.existCarouselMessage);
        return;
    }

    const isHomePage = window.location.pathname === "/";
    
    if (!isHomePage) {
      console.log(CONSTANTS.wrongPageMessage);
      return;
    }

    state.favorites = getFavoritesFromLocalStorage();
    let products = getProductsFromLocalStorage();

    if (products) {
      state.products = products;

    } else {
      try {
        const response = await fetch(CONSTANTS.productsApiUrl);
        if (!response.ok) {
          throw new Error(` ${CONSTANTS.logs.httpErrorCodeMessage}: ${response.status}`);
        }
        const data = await response.json();
        state.products = data;
        saveProductsToLocalStorage(data);
      } catch (error) {
        console.error(readProductFromAPIErrorMessage, error);
        return;
      }
    }

    const appendLocation = document.querySelector(
      `.${CONSTANTS.storiesLocation}`
    );
 
    if (!appendLocation) {
      return;
    }

    const carouselEl = buildCarousel(state.products);
    appendLocation.after(carouselEl);

    const existingStyle = document.querySelector(".carousel-style");
    if (!existingStyle) {
        const styleEl = createEl("style", { class: "carousel-style" }, [styles]);
        document.head.appendChild(styleEl);
    }

    attachEventListeners();
};

init();

})();
