const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scale = 30;
ctx.scale(scale, scale);

// Matriz del tablero
function createMatrix(w, h) {
    return Array.from({ length: h }, () => new Array(w).fill(0));
}

const arena = createMatrix(10, 20);

// Pieza básica (cuadrado)
const player = {
    pos: { x: 4, y: 0 },
    matrix: [
        [1, 1],
        [1, 1]
    ]
};

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = "#00eaff";
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (
                m[y][x] !== 0 &&
                (arena[y + o.y] &&
                 arena[y + o.y][x + o.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
    }
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        player.pos.x--;
    } else if (event.key === "ArrowRight") {
        player.pos.x++;
    } else if (event.key === "ArrowDown") {
        playerDrop();
    }
});

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
        dropCounter = 0;
    }

    draw();
    requestAnimationFrame(update);
}

update();
``
