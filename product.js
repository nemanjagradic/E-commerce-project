let currentItem = JSON.parse(localStorage.getItem('currentItem'));
const items = JSON.parse(localStorage.getItem('allItems'));
const productPage = document.querySelector('.product-page');
console.log(items);

const renderProduct = function (currentItem) {
  productView.render(currentItem);
};

renderProduct(currentItem);

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

class ClassWatcher {
  constructor(
    targetNode,
    classToWatch,
    classAddedCallback,
    classRemovedCallback
  ) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = mutationsList => {
    mutationsList.forEach(mutation => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        let currentClassState = mutation.target.classList.contains(
          this.classToWatch
        );
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            this.classAddedCallback();
          } else {
            this.classRemovedCallback();
          }
        }
      }
    });
  };
}

let targetNode = document.querySelector('.overlay-2');
const productImages = document.querySelector('.product-images');

function workOnClassAdd() {
  productImages.style.position = 'static';
  productImages.style.zIndex = '1';
}

function workOnClassRemoval() {
  productImages.style.position = 'relative';
  productImages.style.zIndex = '-2';
}

let classWatcher = new ClassWatcher(
  targetNode,
  'hidden',
  workOnClassAdd,
  workOnClassRemoval
);

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
  currentItem.totalPrice = currentItem.quantity * currentItem.price;
  quantity.textContent = currentItem.quantity;
  total.textContent = `$${currentItem.totalPrice}`;
};

const qunatityPlus = function () {
  increaseQuantity.addEventListener('click', function () {
    currentItem.quantity = currentItem.quantity + 1;
    updateProductQuantityPrice();
  });
};
qunatityPlus();

const qunatityMinus = function () {
  decreaseQuantity.addEventListener('click', function () {
    if (currentItem.quantity <= 1) return;
    currentItem.quantity = currentItem.quantity - 1;
    updateProductQuantityPrice();
  });
};
qunatityMinus();

let shoppingCartItems = [];
let subtotal = '';

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

// const deleteItems = function () {
//   localStorage.removeItem('shoppingItems');
// };
// deleteItems();

// class ShoppingItem {
//   shoppingCartItems = [];
//   subtotal = '';

//   constructor() {
//     addToCart.addEventListener('click', this.renderShoppingItem.bind(this));
//     window.addEventListener('load', this.loadShoppingItems.bind(this));
//   }

//   generateMarkupShoppingItem(item) {
//     return `<div class="shopping-cart-item d-flex" data-id =${item.id}>
//                <div class="shopping-item-img">
//                  <img src="${item.img[0]}" alt="" />
//                </div>
//                <div class="shopping-cart-content">
//                  <div class="shopping-item-title-price d-flex">
//                    <h6 class="shopping-item-title">${item.title}</h6>
//                    <p class="shopping-item-price">$${item.totalPrice.toFixed(
//                      2
//                    )}</p>
//                 </div>
//                 <div class="shopping-item-quantity">
//                   <button class="decrease-quantity">
//                     <i class="fa-solid fa-minus"></i>
//                   </button>
//                   <div data-id = ${item.id} class="quantity">${
//       item.quantity
//     }</div>
//                   <button class="increase-quantity">
//                     <i class="fa-solid fa-plus"></i>
//                   </button>
//                 </div>
//                 <div class="delete-shopping-item">
//                   <i class="fa-solid fa-xmark"></i>
//                 </div>
//               </div>
//             </div>`;
//   }

//   renderShoppingItem() {
//     if (this.shoppingCartItems.find(item => item.id === currentItem.id)) return;
//     else this.shoppingCartItems.push(currentItem);

//     shoppingIcon.classList.remove('hidden');
//     shoppingIcon.textContent = this.shoppingCartItems.length;

//     const markup = this.generateMarkupShoppingItem(currentItem);
//     cartItems.insertAdjacentHTML('afterbegin', markup);

//     this.renderSubtotal();
//     this.quantityItemPlus();
//     this.quantityItemMinus();
//     this.persistShoppingItems();
//     // this.deleteItem();
//   }

//   renderSubtotal() {
//     this.shoppingCartItems.forEach(function (item) {
//       let subtotal = 0;
//       subtotal = Number(subtotal + item.totalPrice);
//       subtotalEl.textContent = `$${subtotal}`;
//     });
//   }

//   quantityItemPlus() {
//     const quantityButtons = document.querySelectorAll(
//       '.shopping-item-quantity'
//     );
//     quantityButtons.forEach(btn => {
//       btn.addEventListener('click', this.buttonPlus.bind(this));
//     });
//   }

//   buttonPlus(e) {
//     const quantityPlus = e.target.closest('.increase-quantity');
//     const quantity = quantityPlus.parentElement.querySelector('.quantity');
//     const id = +quantity.dataset.id;
//     const currentItem = this.shoppingCartItems.find(item => item.id === id);

//     currentItem.quantity = currentItem.quantity + 1;
//     quantity.textContent = currentItem.quantity;

//     currentItem.totalPrice = currentItem.quantity * currentItem.price;
//     const totalPrice = quantityPlus.parentElement.parentElement.querySelector(
//       '.shopping-item-price'
//     );
//     totalPrice.textContent = `$${currentItem.totalPrice.toFixed(2)}`;

//     this.renderSubtotal();
//     this.persistShoppingItems();
//   }

//   quantityItemMinus() {
//     const quantityButtons = document.querySelectorAll(
//       '.shopping-item-quantity'
//     );
//     quantityButtons.forEach(btn => {
//       btn.addEventListener('click', this.buttonMinus.bind(this));
//     });
//   }

//   buttonMinus(e) {
//     const quantityMinus = e.target.closest('.decrease-quantity');
//     const quantity = quantityMinus.parentElement.querySelector('.quantity');
//     const id = +quantity.dataset.id;
//     const currentItem = this.shoppingCartItems.find(item => item.id === id);

//     if (currentItem.quantity > 1)
//       currentItem.quantity = currentItem.quantity - 1;
//     quantity.textContent = currentItem.quantity;

//     currentItem.totalPrice = currentItem.quantity * currentItem.price;
//     const totalPrice = quantityMinus.parentElement.parentElement.querySelector(
//       '.shopping-item-price'
//     );
//     totalPrice.textContent = `$${currentItem.totalPrice.toFixed(2)}`;

//     this.renderSubtotal();
//     this.persistShoppingItems();
//   }

//   persistShoppingItems() {
//     localStorage.setItem(
//       'shoppingItems',
//       JSON.stringify(this.shoppingCartItems)
//     );
//   }

//   initShoppingItems() {
//     const storage = localStorage.getItem('shoppingItems');
//     if (storage) this.shoppingCartItems = JSON.parse(storage);
//   }

//   loadShoppingItems() {
//     this.initShoppingItems();

//     const markup = this.shoppingCartItems
//       .map(item => {
//         return this.generateMarkupShoppingItem(item);
//       })
//       .join('');

//     cartItems.insertAdjacentHTML('afterbegin', markup);
//     this.quantityItemPlus();
//     this.quantityItemMinus();
//     this.renderSubtotal();
//     // deleteItem();
//   }
// }

// const shoppingItem = new ShoppingItem();

// class App {
//   constructor() {
//     this.showCart();
//     this.hideCart();
//     this.quantityPlus();
//     this.quantityMinus();
//     // this.deleteItems();
//   }

//   showCart() {
//     shoppingCartIcon.addEventListener('click', function () {
//       shoppingCart.classList.remove('hide-cart');
//       overlay.classList.remove('hidden');
//     });
//   }
//   hideCart() {
//     closeCart.addEventListener('click', function () {
//       shoppingCart.classList.add('hide-cart');
//       overlay.classList.add('hidden');
//     });
//     overlay.addEventListener('click', function () {
//       shoppingCart.classList.add('hide-cart');
//       overlay.classList.add('hidden');
//     });
//   }
//   quantityPlus() {
//     increaseQuantity.addEventListener('click', function () {
//       currentItem.quantity = currentItem.quantity + 1;
//       currentItem.totalPrice = currentItem.quantity * currentItem.price;
//       quantity.textContent = currentItem.quantity;
//       total.textContent = `$${currentItem.totalPrice}`;
//     });
//   }
//   quantityMinus() {
//     decreaseQuantity.addEventListener('click', function () {
//       if (currentItem.quantity <= 1) return;
//       currentItem.quantity = currentItem.quantity - 1;
//       currentItem.totalPrice = currentItem.quantity * currentItem.price;
//       quantity.textContent = currentItem.quantity;
//       total.textContent = `$${currentItem.totalPrice}`;
//     });
//   }
//   deleteItems() {
//     localStorage.removeItem('shoppingItems');
//   }
// }

// const app = new App();
