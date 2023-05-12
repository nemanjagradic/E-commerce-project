class ProductsView extends View {
  _parentEl = document.querySelector('.product-list');

  _generateMarkup() {
    return `
          <div class="product-item col-md-4" data-category=${this._data.category}>
              <a data-id = ${this._data.id} href ="product.html">
              <div class="product-img">
              <img src="${this._data.img[0]}" alt="" />
              </div>
              <h2 class="product-title">${this._data.title}</h2>
              <p class="product-price">$${this._data.price}</p>
              </a>
          </div>`;
  }
}

const productsView = new ProductsView();
