function linearGradientFill(x1, y1, x2, y2, color1, color2) {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
}

function rotateAbout(angle, x, y) {
    translate(x, y);
    rotate(angle);
    translate(-x, -y);
}

const lowerSnakeCase = (s) => s.replace(/ /g, "_").toLowerCase();

const renameKeys = (obj, keyTransformer) =>
    Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [keyTransformer(k), v])
    );

const withoutOxford = (ar, s) =>
    ar.length <= 2
        ? ar.join(s)
        : ar.slice(0, ar.length - 1).join(", ") + s + ar[ar.length - 1];

function periodicEase(x, period) {
    let q = floor(x / period) * period;
    return easeInOutQuad(x % period, q, period, period);
}

function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
