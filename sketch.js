const colWidth = 350;
const maxRowHeight = 130;
let rowHeight;
let projects = [];

let data;

function preload() {
  data = loadTable("projects.csv", "header")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  projects = Array.from(Object.values(data.rows).map(r => r.obj))
    .map(o => renameKeys(o, lowerSnakeCase));

  projects.forEach(p => {
    p.name = p.name.trim()
    const img_url = `assets/images/${p.name}.jpg`;
    p.image = loadImage(img_url);
  });
  shuffle(projects, true);
}


function draw() {
  background('white');

  textAlign(CENTER);
  fill('aliceblue');
  textSize(40);
  text("Creative Coding Lab | Section 1", width / 2, 160)

  let p = findProjectUnderMouse();
  if (p) {
    let img = p.image;
    let s = min(window.width / img.width, 250 / img.height);
    let w = img.width * s;
    image(img, (width - w) / 2, 0, w, img.height * s);
    background(255, 150)
  }

  doLayout();
  projects.forEach(p => drawProject(p, projectIsUnderMouse(p)));
}

function doLayout() {
  rowHeight = maxRowHeight;
  projects.forEach(p => p.y = Infinity);
  for (; Math.max(...projects.map(p => p.y)) + rowHeight > height; rowHeight -= 10) {
    let cols = max(1, floor(width / colWidth));
    let tx = (width - cols * colWidth) / 2;
    projects.forEach((p, i) => {
      let col = i % cols;
      let row = floor(i / cols);
      let x = tx + colWidth * col;
      let y = 250 + rowHeight * row;
      projects[i] = { ...p, x, y, row, col };
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function drawProject({ name, authors, x, y }, highlight) {
  push();
  textAlign(CENTER)
  translate(x, y)

  if (highlight) {
    fill(200, 100);
    noStroke();
    rect(0, 0, colWidth, rowHeight, 10);

    fill('red');
    textSize(18)
    text("Click to play", 0, 65, colWidth - 20);
  }

  fill('black')
  textFont('Roboto')
  textSize(18)
  textStyle(BOLD);
  text(name, 0, 10, colWidth - 20)

  authors = withoutOxford(authors.split(/\s*&\s*/), ' & ');
  textSize(13)
  textStyle(NORMAL);
  text(authors, 0, 40, colWidth - 20)

  pop()
}

function mousePressed() {
  let project = findProjectUnderMouse();
  if (project) {
    window.open(project.url, 'project')
  }
}

function mouseMoved() {
  let project = findProjectUnderMouse();
  if (project) {
    cursor('HAND');
    // console.info('HAND')
  } else {
    cursor('DEFAULT');
    // console.info('default');
  }
}

const findProjectUnderMouse = () => projects.find(projectIsUnderMouse);
const projectIsUnderMouse = ({ x, y }) => x <= mouseX && mouseX < x + colWidth && y <= mouseY && mouseY < y + rowHeight;

const lowerSnakeCase = s =>
  s.replace(/ /g, '_').toLowerCase();

const renameKeys = (obj, keyTransformer) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [keyTransformer(k), v]))

const withoutOxford = (ar, s) => ar.length <= 2 ? ar.join(s) : ar.slice(0, ar.length - 1).join(', ') + s + ar[ar.length - 1];
