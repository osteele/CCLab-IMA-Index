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
    const getBottom = () => Math.max(...projects.map(p => p.y)) + rowHeight;
    const tooTall = () => getBottom() > height;

    function assignGridPositions(cells, cols, colWidth, rowHeight, leftMargin, topMargin) {
        projects.forEach((p, i) => {
            const col = i % cols;
            const row = floor(i / cols);
            const x = leftMargin + colWidth * col;
            const y = topMargin + rowHeight * row;
            projects[i] = { ...p, x, y, row, col };
        });
    }

    projects.forEach(p => { p.y = Infinity });
    rowHeight = maxRowHeight;
    while (true) {
        const cols = max(1, floor(width / colWidth));
        gridMarginLeft = (width - cols * colWidth) / 2;
        assignGridPositions(projects, cols, colWidth, rowHeight, gridMarginLeft, headerPaddingTop + headerHeight + headingMarginBottom);
        if (!tooTall() || rowHeight - 10 >= minRowHeight) break;
        rowHeight -= 10;
    }

    if (getBottom() > height) {
        resizeCanvas(width, getBottom());
    }
}

const findProjectUnderMouse = () => projects.find(projectIsUnderMouse);

const projectIsUnderMouse = (project) =>
    pointInRect({ x: mouseX, y: mouseY }, { x: project.x, y: project.y, width: colWidth, height: rowHeight });
