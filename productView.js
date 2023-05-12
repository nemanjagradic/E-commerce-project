class ProductView extends View {
  _parentEl = document.querySelector('.product-page');

  _generateMarkup() {
    return `<h1 class="product-name">${this._data.title}</h1>
        <div class="product-container d-flex">
          <div class="product-images">
            <div class="product-main-image">
              <img class='pr-main-img' src="${this._data.img[0]}" alt="" />
            </div>
            <div class="product-small-images d-flex">
              ${this._data.img
                .map(i => {
                  return `<div class="small-img">
                        <img class ='pr-small-img' src="${i}" alt="" />
                        </div>`;
                })
                .join('')}
            </div>
          </div>
          <div class="product-content">
            <p class="description">
              ${this._data.description}
            </p>
            <div class="info d-flex justify-content-between">
              <h2>Quantity</h2>
              <div class="quantity-buttons">
                <button class='decrease-quantity'><i class="fa-solid fa-minus"></i></button>
                <span class="quantity">${this._data.quantity}</span>
                <button class='increase-quantity'><i class="fa-solid fa-plus"></i></button>
              </div>
              <div class="price">$${this._data.totalPrice}</div>
            </div>
            <div class="add-and-buy d-flex justify-content-between">
              <button class='add-to-cart'>Add To Cart</button>
              <button>Buy Now</button>
            </div>
          </div>
        </div>
        <div class="additional-description d-flex justify-content-evenly">
          <div class="weight">
            <h4>Weight:</h4>
            <p>${this._data.weight}</p>
          </div>
          <div class="dimensions">
            <h4>Dimensions:</h4>
            <p>${this._data.dimensions}</p>
          </div>
          ${
            this._data?.size
              ? `<div class="size">
                  <h4>Size:</h4>
                  <p>${this._data?.size ? this._data?.size : ''}</p>
                </div>`
              : ''
          }
        </div>`;
  }
}

const productView = new ProductView();
