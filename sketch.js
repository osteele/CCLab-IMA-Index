
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
  computeLayout();
}

function draw() {
  clear();

  push();
  translate(10 + gridMarginLeft, 5);
  scale(1 / 4);
  logo();
  pop();

  const hovered = millis() < lastMouseMoveTime + 30000 && findProjectUnderMouse();
  if (hovered) {
    push();
    translate(gridMarginLeft, 0);
    drawHeaderProject(hovered, { includeInstructions: true });
    pop();
  } else {
    drawHeaderStrip();
  }

  textAlign(LEFT);
  fill("aliceblue");
  textSize(40);
  text("Creative Coding Lab | Spring 2021 | Section 1", 260, 45);

  projects.forEach((p) => drawProjectCard(p, projectIsUnderMouse(p)));

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
  const c1 = w + 10;
  const c2 = c1 + cw * 0.6;

  image(img, 0, topPadding, w, img.height * s);

  fill("black");
  textAlign(LEFT);
  textSize(12);

  textStyle(BOLDITALIC);
  includeTitle && text(name, 0, 15);

  textStyle(ITALIC);
  text(description, c1, topPadding, c2 - c1 - 15);

  textStyle(BOLD);
  includeInstructions && instructions && text("Instructions", c2, topPadding, width / 3 - 10);

  textStyle(NORMAL);
  includeInstructions && text(instructions, c2, 30, cw * 0.8);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth - 2 * canvasPaddingHorizontal, windowHeight);
  computeLayout();
}

function drawProjectCard({ name, authors, x, y }, isHovered) {
  push();
  translate(x, y);
  textAlign(CENTER);
  textFont("Roboto");

  if (isHovered) {
    fill(200, 100);
    noStroke();
    rect(0, 0, colWidth, rowHeight, 10);

  }
  fill(isHovered ? "red" : 235);
  textSize(18);
  text("Click to play", 0, 60, colWidth - 20);

  fill("black");
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
