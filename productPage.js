let items = JSON.parse(localStorage.getItem('allItems'));
const horisonTable = items[3];

const renderProduct = function (item) {
  productView.render(item);
};

renderProduct(horisonTable);

const createTrendingItems = function (items) {
  trendingView.render(items);
};

createTrendingItems(items);

const nav = document.querySelector('.nav');

const obsCallback = function (entries) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const obsOptions = {
  root: null,
  threshold: 0.75,
};

const stickyNavObserver = new IntersectionObserver(obsCallback, obsOptions);
const productPage = document.querySelector('.product-page');
stickyNavObserver.observe(productPage);

const menu = document.querySelector('.menu');
const navSide = document.querySelector('.nav-side');
console.log(menu.firstElementChild);

const showNav = function (btn) {
  btn.addEventListener('click', function () {
    if (navSide.classList.contains('show-nav')) {
      navSide.classList.remove('show-nav');
      menu.innerHTML = '';
      menu.innerHTML = '<i class="fa-solid fa-bars"></i>';
    } else {
      navSide.classList.add('show-nav');
      menu.innerHTML = '';
      menu.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }
  });
};
showNav(menu);

const clickedItem = function (items) {
  const trendingItems = document
    .querySelector('.trending-now')
    .querySelectorAll('.trending-item');

  trendingItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const tag = e.target.closest('a');
      const id = +tag.dataset.id;
      const clickedItem = items.find(item => item.id === id);

      productView.render(clickedItem);
      currentItem = localStorage.setItem(
        'currentItem',
        JSON.stringify(clickedItem)
      );
    });
  });
};

clickedItem(items);

const btnLeft = document.querySelector('.slider_btn-left');
const btnRight = document.querySelector('.slider_btn-right');
const slides = document.querySelectorAll('.trending-item');
let curSlide = 0;

const moveSlider = function (slide) {
  slides.forEach(s => {
    s.style.transform = `translateX(${100 * slide}%)`;
  });
};

const nextSlide = function () {
  if (curSlide === -3) {
    curSlide = 0;
  } else {
    curSlide--;
  }
  moveSlider(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = -3;
  } else {
    curSlide++;
  }
  moveSlider(curSlide);
};

btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

const smallImgs = document.querySelectorAll('.pr-small-img');
const mainImg = document.querySelector('.pr-main-img');

const changeImg = function () {
  smallImgs.forEach(img => {
    img.addEventListener('click', () => {
      mainImg.src = img.src;
    });
  });
};
changeImg();

const shoppingCartIcon = document.querySelector('.shopping-cart-icon');
const closeCart = document.querySelector('.close-cart');
const shoppingCart = document.querySelector('.shopping-cart');
const overlay = document.querySelector('.overlay-2');
let total = document.querySelector('.price');
const quantity = document.querySelector('.quantity');
const increaseQuantity = document.querySelector('.increase-quantity');
const decreaseQuantity = document.querySelector('.decrease-quantity');
const addToCart = document.querySelector('.add-to-cart');
const cartItems = document.querySelector('.shopping-cart-items');
const subtotalEl = document.querySelector('.subtotal');
const shoppingIcon = document.querySelector('.shopping-items');

const showCart = function () {
  shoppingCartIcon.addEventListener('click', function () {
    shoppingCart.classList.remove('hide-cart');
    overlay.classList.remove('hidden');
  });
};
showCart();

const hideCart = function () {
  closeCart.addEventListener('click', function () {
    shoppingCart.classList.add('hide-cart');
    overlay.classList.add('hidden');
  });
  overlay.addEventListener('click', function () {
    shoppingCart.classList.add('hide-cart');
    overlay.classList.add('hidden');
  });
};
hideCart();

const updateProductQuantityPrice = function () {
  horisonTable.totalPrice = horisonTable.quantity * horisonTable.price;
  quantity.textContent = horisonTable.quantity;
  total.textContent = `$${horisonTable.totalPrice}`;
};

const qunatityPlus = function () {
  increaseQuantity.addEventListener('click', function () {
    horisonTable.quantity = horisonTable.quantity + 1;
    updateProductQuantityPrice();
  });
};
qunatityPlus();

const qunatityMinus = function () {
  decreaseQuantity.addEventListener('click', function () {
    if (horisonTable.quantity <= 1) return;
    horisonTable.quantity = horisonTable.quantity - 1;
    updateProductQuantityPrice();
  });
};
qunatityMinus();

const renderShoppingItem = function () {
  addToCart.addEventListener('click', function () {
    if (shoppingCartItems.find(item => item.id === currentItem.id)) return;
    else shoppingCartItems.push(currentItem);

    shoppingIcon.classList.remove('hidden');
    shoppingIcon.textContent = shoppingCartItems.length;

    shoppingView.render(currentItem, false);
    renderSubtotal();
    quantityItemPlus();
    quantityItemMinus();
    persistShoppingItems();
    deleteItem();
  });
};

renderShoppingItem();

const renderSubtotal = function () {
  subtotal = 0;
  shoppingCartItems.forEach(function (item) {
    subtotal = Number(subtotal + item.totalPrice);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  });
};

const quantityItemPlus = function () {
  const quantityButtons = document.querySelectorAll('.shopping-item-quantity');
  quantityButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const quantityPlus = e.target.closest('.increase-quantity');
      const quantity = quantityPlus.parentElement.querySelector('.quantity');
      const id = +quantity.dataset.id;
      const currentItem = shoppingCartItems.find(item => item.id === id);

      currentItem.quantity = currentItem.quantity + 1;
      quantity.textContent = currentItem.quantity;

      currentItem.totalPrice = currentItem.quantity * currentItem.price;
      const totalPrice = quantityPlus.parentElement.parentElement.querySelector(
        '.shopping-item-price'
      );
      totalPrice.textContent = `$${currentItem.totalPrice.toFixed(2)}`;

      renderSubtotal();
      persistShoppingItems();
    });
  });
};

const quantityItemMinus = function () {
  const quantityButtons = document.querySelectorAll('.shopping-item-quantity');
  quantityButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const quantityMinus = e.target.closest('.decrease-quantity');
      const quantity = quantityMinus.parentElement.querySelector('.quantity');
      const id = +quantity.dataset.id;
      const currentItem = shoppingCartItems.find(item => item.id === id);

      if (currentItem.quantity > 1)
        currentItem.quantity = currentItem.quantity - 1;
      quantity.textContent = currentItem.quantity;

      currentItem.totalPrice = currentItem.quantity * currentItem.price;
      const totalPrice =
        quantityMinus.parentElement.parentElement.querySelector(
          '.shopping-item-price'
        );
      totalPrice.textContent = `$${currentItem.totalPrice.toFixed(2)}`;

      renderSubtotal();
      persistShoppingItems();
    });
  });
};

const persistShoppingItems = function () {
  localStorage.setItem('shoppingItems', JSON.stringify(shoppingCartItems));
};

const initShoppingItems = function () {
  const storage = localStorage.getItem('shoppingItems');
  if (storage) shoppingCartItems = JSON.parse(storage);
};
initShoppingItems();

const loadShoppingItems = function () {
  window.addEventListener('load', function () {
    shoppingCartItems
      .map(item => {
        shoppingView.render(item, false);
      })
      .join('');

    quantityItemPlus();
    quantityItemMinus();
    renderSubtotal();
    deleteItem();
  });
};
loadShoppingItems();

const deleteItem = function () {
  const deleteEls = document.querySelectorAll('.delete-shopping-item');
  deleteEls.forEach(el => {
    el.addEventListener('click', function (e) {
      const item = e.target.closest('.shopping-cart-item');
      const itemId = +item.dataset.id;
      const currentItemIndex = shoppingCartItems.findIndex(
        item => item.id === itemId
      );
      shoppingCartItems.splice(currentItemIndex, 1);
      item.remove();
      persistShoppingItems();

      shoppingIcon.classList.remove('hidden');
      shoppingIcon.textContent = shoppingCartItems.length;
    });
  });
};
