export class Camera {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    moveLeft(offset) { this.x += offset; }
    moveRight(offset) { this.x -= offset; }
    moveUp(offset) { this.y -= offset; }
    moveDown(offset) { this.y += offset; }

    zoomIn(factor) { this.z *= factor; }
    zoomOut(factor) { this.z /= factor; }
}