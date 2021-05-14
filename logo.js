function logo() {
    const wobbleAmp = 20;

    push();
    angleMode(DEGREES);

    translate(83, 100);
    noStroke();

    linearGradientFill(80, 0, 0, 80, "#FECF84", "#FD3936");
    circle(0, 0, 165 + wobbleAmp * sin(millis() / 10));

    translate(100, 0);
    linearGradientFill(80, 0, 0, 80, "#EBFE75", "#26CD8E");
    circle(0, 0, 165 + wobbleAmp * sin(millis() / 15));

    const squareSize = 145 + wobbleAmp * sin(millis() / 18);
    translate(30, -squareSize / 2);
    rotateAbout(10, squareSize / 2, squareSize / 2);
    linearGradientFill(squareSize, 0, 0, squareSize, "#98FBF3", "#893DFB");
    rect(0, 0, squareSize, squareSize);

    const cornerSize = 50;
    translate(squareSize - cornerSize, 0);
    linearGradientFill(squareSize, 0, 0, squareSize - cornerSize, "#893DFB", "#98FBF3");
    triangle(0, 0, cornerSize, cornerSize, 0, cornerSize);
    pop();
}
