class WindowViewport extends HTMLElement {
  #transformAncestor = undefined;
  #transform = new DOMMatrix();

  constructor() {
    super();

    this.attachShadow({mode: "open"}).innerHTML = `
      <style>
       :host {
          display: inline-block;
          overflow: hidden;
          width: 600px;
          height: 400px;
          background: #cff;
          background-image:
            repeating-linear-gradient(to right, #8888, #fff8 100px),
            repeating-linear-gradient(to bottom, #8888, #fff8 100px);
       }
      </style>
      <div id="transformAncestor">
        <slot></slot>
      </div>
    `;

    this.#transformAncestor = this.shadowRoot.getElementById("transformAncestor");

    this.addEventListener("pointerdown", this.#pointerdown);
  }

  #dragStartPoint = undefined;
  #dragStartTransform = undefined;

  #pointerdown = ((e) => {
    console.log(e);

    // Ignore the event if it started on anything other than this element or something in its shadow
    // root.
    if (e.target !== this) {
      return;
    }

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
    this.#transformAncestor.style.transform = String(this.#transform);
    this.style.backgroundPositionX = this.#transform.e + "px";
    this.style.backgroundPositionY = this.#transform.f + "px";
  }
}

customElements.define("window-viewport", WindowViewport);
