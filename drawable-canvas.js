class DrawableCanvas extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open"}).innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        #mainCanvas {
          vertical-align: middle;
          border: 1px solid blue;
        }
      </style>
      <canvas id="mainCanvas"></canvas>
    `;

    const canvas = this.shadowRoot.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");

    const eventToPoint = (e) => ({x: e.offsetX, y: e.offsetY});

    const drawLine = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    let lastPoint = undefined;

    canvas.addEventListener("pointerdown", (e) => {
      lastPoint = eventToPoint(e);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!lastPoint) return;
      const nextPoint = eventToPoint(e);
      drawLine(lastPoint.x, lastPoint.y, nextPoint.x, nextPoint.y);
      lastPoint = nextPoint;
    });

    canvas.addEventListener("pointerup", (e) => {
      if (!lastPoint) return;
      const nextPoint = eventToPoint(e);
      drawLine(lastPoint.x, lastPoint.y, nextPoint.x, nextPoint.y);
      lastPoint = undefined;
    });
  }
}

customElements.define("drawable-canvas", DrawableCanvas);
