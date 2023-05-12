const items = JSON.parse(localStorage.getItem('allItems'));
console.log(items);

const createProductItems = function () {
  items
    .map(item => {
      productsView.render(item, false);
    })
    .join('');
};
createProductItems();

const nav = document.querySelector('.nav');

const obsCallback = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    nav.classList.add('sticky');
  }
};

const obsOptions = {
  root: null,
  threshold: 0.4,
};

const stickyNavObserver = new IntersectionObserver(obsCallback, obsOptions);
const productList = document.querySelector('.product-list');
stickyNavObserver.observe(productList);

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

const buttons = document.querySelector('.categories').querySelectorAll('li');
const itemEls = document
  .querySelector('.product-list')
  .querySelectorAll('.product-item');
const categoryName = document.querySelector('.category-name');

const showCategory = function () {
  buttons.forEach(button => {
    button.addEventListener('click', function () {
      displayNone();
      const category = button.dataset.category;
      if (category === 'all') {
        itemEls.forEach(item => (item.style.display = 'block'));
        categoryName.textContent = `${category[0].toUpperCase()}${category.slice(
          1
        )}`;
      }
      itemEls.forEach(item => {
        if (item.dataset.category.includes(category)) {
          item.style.display = 'block';
          categoryName.textContent = `${category[0].toUpperCase()}${category.slice(
            1
          )}`;
        }
      });
    });
  });
};
showCategory();

displayNone = function () {
  itemEls.forEach(item => {
    item.style.display = 'none';
  });
};

const goToPage = function (items) {
  itemEls.forEach(item => {
    item.addEventListener('click', function (e) {
      const tag = e.target.closest('a');
      const id = +tag.dataset.id;
      const currentItem = items.find(item => item.id === id);
      localStorage.setItem('currentItem', JSON.stringify(currentItem));
    });
  });
};

goToPage(items);

const shoppingCartIcon = document.querySelector('.shopping-cart-icon');
const closeCart = document.querySelector('.close-cart');
const shoppingCart = document.querySelector('.shopping-cart');
const overlay = document.querySelector('.overlay-2');
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

const persistShoppingItems = function () {
  localStorage.setItem('shoppingItems', JSON.stringify(shoppingCartItems));
};
