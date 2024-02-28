class DraggableWindow extends HTMLElement {
  #transform = new DOMMatrix();

  constructor() {
    super();

    this.attachShadow({mode: "open"}).innerHTML = `
      <style>
        :host {
          position: absolute;
          border: 4px solid #f88;
          background-color: #eee;
        }

        #title {
          background: #888;
          padding: 8px;

          cursor: grab;
          user-select: none;

          &:hover {
            background: #ccc;
          }
        }

        slot:not([name]) {
          display: block;
          padding: 8px;
        }
      </style>
      <div id="title"><slot name="title"></slot></div>
      <slot></slot>
    `;

    const title = this.shadowRoot.getElementById("title");
    title.addEventListener("pointerdown", this.#pointerdown);
  }

  #dragStartPoint = undefined;
  #dragStartTransform = undefined;

  #pointerdown = ((e) => {
    console.log(e);

    this.#dragStartPoint = {x: e.clientX, y: e.clientY};
    this.#dragStartTransform = DOMMatrix.fromMatrix(this.#transform);

    this.setPointerCapture(e.pointerId);
    this.addEventListener("pointermove", this.#pointermove);
    this.addEventListener("pointerup", this.#pointerup);
    this.addEventListener("pointercancel", this.#pointercancel);
  }).bind(this);

  #pointermove = ((e) => {
    console.log(e);

    this.#transform = this.#dragStartTransform.translate(
      e.clientX - this.#dragStartPoint.x,
      e.clientY - this.#dragStartPoint.y,
    );
    this.#updateTransform();
  }).bind(this);

  #pointerup = ((e) => {
    console.log(e);

    this.releasePointerCapture(e.pointerId);
    this.removeEventListener("pointermove", this.#pointermove);
    this.removeEventListener("pointerup", this.#pointerup);
    this.removeEventListener("pointercancel", this.#pointercancel);
  }).bind(this);

  #pointercancel = ((e) => {
    console.log(e);

    this.releasePointerCapture(e.pointerId);
    this.removeEventListener("pointermove", this.#pointermove);
    this.removeEventListener("pointerup", this.#pointerup);
    this.removeEventListener("pointercancel", this.#pointercancel);
  }).bind(this);

  #updateTransform() {
    console.log(this.#transform);
    this.#transform.e = Math.round(this.#transform.e);
    this.#transform.f = Math.round(this.#transform.f);
    this.style.transform = String(this.#transform);
  }
}

customElements.define("draggable-window", DraggableWindow);
