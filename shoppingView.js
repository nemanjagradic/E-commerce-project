class ShoppingView extends View {
  _parentEl = document.querySelector('.shopping-cart-items');

  _generateMarkup() {
    return `
    <div class="shopping-cart-item d-flex" data-id =${this._data.id}>
        <div class="shopping-item-img">
          <img src="${this._data.img[0]}" alt="" />
        </div>
        <div class="shopping-cart-content">
          <div class="shopping-item-title-price d-flex">
            <h6 class="shopping-item-title">${this._data.title}</h6>
            <p class="shopping-item-price">$${this._data.totalPrice.toFixed(
              2
            )}</p>
          </div>
          <div class="shopping-item-quantity">
            <button class="decrease-quantity">
              <i class="fa-solid fa-minus"></i>
            </button>
            <div data-id = ${this._data.id} class="quantity">${
      this._data.quantity
    }</div>
            <button class="increase-quantity">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="delete-shopping-item">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>`;
  }
}

const shoppingView = new ShoppingView();
