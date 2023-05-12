class TrendingView extends View {
  _parentEl = document.querySelector('.trending-now');

  _generateMarkup() {
    return this._data
      .slice(6, 14)
      .map(item => {
        let href = window.location.href.slice(-10);
        return `<div class="trending-item">
              <a data-id = ${item.id} href =${
          href !== 'product.html' ? 'product.html' : ''
        }>
              <div class="trending-img">
                <img src="${item.img[0]}" alt="" />
              </div>
              <h5 class="trending-title">${item.title}</h5>
              <p class="product-price">$${item.price}</p>
              </a>
            </div>`;
      })
      .join('');
  }
}

const trendingView = new TrendingView();
