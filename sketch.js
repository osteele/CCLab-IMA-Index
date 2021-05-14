const headerPaddingTop = 55;
const headerHeight = 250;
const headingMarginBottom = 20;
const canvasPaddingHorizontal = 20;

const colWidth = 350;
const minRowHeight = 80;
const maxRowHeight = 130;
let rowHeight;

let gridMarginLeft = 0;

let data;
let projects = [];

let lastMouseMoveTime;

function preload() {
  data = loadTable("projects.csv", "header");
}

function setup() {
  createCanvas(windowWidth - 2 * canvasPaddingHorizontal, windowHeight);

  projects = Array.from(Object.values(data.rows).map((r) => r.obj)).map((o) =>
    renameKeys(o, lowerSnakeCase)
  );

  projects.forEach((p) => {
    p.name = p.name.trim();
    const img_url = `assets/images/${p.name}.jpg`;
    p.image = loadImage(img_url);
  });
  shuffle(projects, true);
}

function draw() {
  background("white");

  push();
  translate(10 + gridMarginLeft, 5);
  scale(1 / 4);
  logo();
  pop();

  const selectedProject = millis() < lastMouseMoveTime + 30000 && findProjectUnderMouse();
  if (selectedProject) {
    push();
    translate(gridMarginLeft, 0);
    drawHeaderProject(selectedProject, { includeInstructions: true });
    pop();
  } else {
    drawHeaderStrip();
  }

  textAlign(LEFT);
  fill("aliceblue");
  textSize(40);
  text("Creative Coding Lab | Spring 2021 | Section 1", 260, 45);

  computeLayout();
  projects.forEach((p) => drawProject(p, projectIsUnderMouse(p)));

}

function drawHeaderStrip() {
  push();
  const pw = width * 2 / 3 + 20;
  const tx = -periodicEase(4 * frameCount, pw);
  translate(tx % (pw * projects.length) + gridMarginLeft, 0);
  for (let i = 0; i < projects.length + 2; i++) {
    drawHeaderProject(projects[i % projects.length], { includeTitle: true });
    translate(pw, 0);
  }
  pop();

  noStroke();
  fill(255, 100);
  rect(0, 0, width, headerPaddingTop + headerHeight);

  linearGradientFill(0, 0, 2 * gridMarginLeft, 0, "#ffffff", "#ffffff00");
  rect(0, headerPaddingTop, 2 * gridMarginLeft, headerHeight);
  linearGradientFill(width - 2 * gridMarginLeft, 0, width, 0, "#ffffff00", "#ffffff");
  rect(width - 2 * gridMarginLeft, headerPaddingTop, 2 * gridMarginLeft, headerHeight);
}

function drawHeaderProject({ name, image: img, description, instructions }, { includeTitle, includeInstructions }) {
  push();
  translate(0, headerPaddingTop);

  const topPadding = includeTitle ? 20 : 10;
  const cw = (width - 2 * gridMarginLeft) / 3;
  const s = min(cw / img.width, (headerHeight - topPadding) / img.height);
  const w = img.width * s;
  const c1 = cw + 10;
  const c2 = 2 * cw;

  image(img, 0, topPadding, w, img.height * s);

  fill("black");
  textAlign(LEFT);
  textSize(12);

  textStyle(BOLDITALIC);
  includeTitle && text(name, 0, 15);

  textStyle(ITALIC);
  text(description, c1, topPadding, c2 - c1 - 10);

  textStyle(BOLD);
  includeInstructions && instructions && text("Instructions", c2, topPadding, width / 3 - 10);

  textStyle(NORMAL);
  includeInstructions && text(instructions, c2, 40, 3 * cw - 10);

  pop();
}

function computeLayout() {
  rowHeight = maxRowHeight;
  projects.forEach((p) => (p.y = Infinity));
  const getBottom = () => Math.max(...projects.map((p) => p.y)) + rowHeight;
  for (; getBottom() > height && rowHeight > minRowHeight; rowHeight -= 10) {
    const cols = max(1, floor(width / colWidth));
    const tx = (width - cols * colWidth) / 2;
    gridMarginLeft = tx;
    projects.forEach((p, i) => {
      const col = i % cols;
      const row = floor(i / cols);
      const x = tx + colWidth * col;
      const y = headerPaddingTop + headerHeight + headingMarginBottom + rowHeight * row;
      projects[i] = { ...p, x, y, row, col };
    });
  }
  if (getBottom() > height) {
    resizeCanvas(width, getBottom());
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 2 * canvasPaddingHorizontal, windowHeight);
}

function drawProject({ name, authors, x, y }, highlight) {
  push();
  textAlign(CENTER);
  translate(x, y);

  if (highlight) {
    fill(200, 100);
    noStroke();
    rect(0, 0, colWidth, rowHeight, 10);

  }
  fill(highlight ? "red" : 235);
  textSize(18);
  text("Click to play", 0, 60, colWidth - 20);

  fill("black");
  textFont("Roboto");
  textSize(18);
  textStyle(BOLD);
  text(name, 0, 10, colWidth - 20);

  authors = withoutOxford(authors.split(/\s*&\s*/), " & ");
  textSize(13);
  textStyle(NORMAL);
  text(authors, 0, 40, colWidth - 20);

  pop();
}

function mousePressed() {
  let project = findProjectUnderMouse();
  if (project) {
    window.open(project.url, "project");
  }
}

function mouseMoved() {
  lastMouseMoveTime = millis();
  // the following doesn't have any effect
  let project = findProjectUnderMouse();
  if (project) {
    cursor("HAND");
    // console.info('HAND')
  } else {
    cursor("DEFAULT");
    // console.info('default');
  }
}

const findProjectUnderMouse = () => projects.find(projectIsUnderMouse);
const projectIsUnderMouse = ({ x, y }) =>
  x <= mouseX && mouseX < x + colWidth && y <= mouseY && mouseY < y + rowHeight;

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

// const periodicEase = (x, period) => floor(x / period) * period + ease(x % period);

// const ease = x => easeInOut

function easeInOutQuad(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
