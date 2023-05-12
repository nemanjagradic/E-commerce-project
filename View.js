class View {
  _data;
  _parentEl = '';

  render(data, clear = true) {
    this._data = data;

    const markup = this._generateMarkup();

    if (clear) this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
