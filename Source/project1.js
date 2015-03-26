////////////////////////////////////////////
//
// project1.js
//
// Vitontonio Carmalitano
// Mathew Sherry
// CS452: Project #1
// March 26, 2015
//
////////////////////////////////////////////

var gl;
var program;

var colors =
    [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(1.0, 0.0, 1.0, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.0, 0.5, 0.5, 1.0),
    ];

// Positioning-related variables.
var numVertices = 6;
var vertices =
    [
        vec2(-0.25, -0.25),
        vec2(-0.25, 0.25),
        vec2(0.25, 0.25),
        vec2(0.3, 0.3),
        vec2(0.75, -0.4),
        vec2(-.75, .5),
    ];

var bufferId;
var vPosition;

// How much we update our x and y per loop.
var xDelta;
var yDelta;
var position = [0, 0, 0];

// The actual speed we're moving at.
const speed = 0.01;

// If we're updating our positions.
var updateXPos = false;
var updateYPos = false;
var resetPos = false;

// Model-view matrix.
var MVMatrix;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("WebGL isn't available");

    // Configure WebGL.
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers.
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU.
    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer.
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

    loop();
};

function onKeyDown(event) {
    var key = String.fromCharCode(event.keyCode);

    switch (key) {
        case 'W':
            yDelta = speed;
            updateYPos = true;
            break;

        case 'S':
            yDelta = -speed;
            updateYPos = true;
            break;

        case 'A':
            xDelta = -speed;
            updateXPos = true;
            break;

        case 'D':
            xDelta = speed;
            updateXPos = true;
            break;

        case '1':
            resetPos = true;
            break;

        default:
            break;
    }
}

function onKeyUp(event) {
    var key = String.fromCharCode(event.keyCode);

    switch (key) {

        // Both W and S control vertical movement.
        case 'W':
        case 'S':
            updateYPos = false;
            break;

        // Both A and D control horizontal movement.
        case 'A':
        case 'D':
            updateXPos = false;
            break;

        default:
            break;
    }
}

function loop() {
    if (updateXPos)
        updateXPosition();

    if (updateYPos)
        updateYPosition();

    MVMatrix = mat4();
    MVMatrix = mult(MVMatrix, translate(position[0], position[1], position[2]));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "MVMatrix"), false, flatten(MVMatrix));

    render();
    requestAnimFrame(loop);
}

function updateXPosition() {
    for (var i = 0; i < numVertices; ++i) {
        vertices[i][0] += xDelta; // "Reset" the vertices to an updated x-position.
    }

    position[0] += xDelta;

    reloadPositionBuffer();
}

function updateYPosition() {
    for (var i = 0; i < numVertices; ++i) {
        vertices[i][1] += yDelta; // "Reset" the vertices to an updated y-position.
    }

    position[1] += yDelta;

    reloadPositionBuffer();
}

function reloadPositionBuffer() {

    // Reload the data into the GPU.
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Reassociate our shader variables with our data buffer.
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices);
}
