const headerPaddingTop = 55;
const headerHeight = 250;
const headingMarginBottom = 20;
const canvasPaddingHorizontal = 20;

const colWidth = 350;
const minRowHeight = 80;
const maxRowHeight = 130;
let rowHeight;

let gridMarginLeft = 0;

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

const findProjectUnderMouse = () => projects.find(projectIsUnderMouse);
const projectIsUnderMouse = ({ x, y }) =>
    x <= mouseX && mouseX < x + colWidth && y <= mouseY && mouseY < y + rowHeight;
