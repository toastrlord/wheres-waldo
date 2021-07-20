function rectIntersectsRect(rect1, rect2) {
    const leftSide1 = Math.min(rect1.x1, rect1.x2);
    const rightSide1 = Math.max(rect1.x1, rect1.x2);
    const topSide1 = Math.max(rect1.y1, rect1.y2);
    const bottomSide1 = Math.min(rect1.y1, rect1.y2);

    const leftSide2 = Math.min(rect2.x1, rect2.x2);
    const rightSide2 = Math.max(rect2.x1, rect2.x2);
    const topSide2 = Math.max(rect2.y1, rect2.y2);
    const bottomSide2 = Math.min(rect2.y1, rect2.y2);

    if (bottomSide1 > topSide2 || bottomSide2 > topSide1) {
        return false;
    }
    if (leftSide1 > rightSide2 || leftSide2 > rightSide1) {
        return false;
    }

    return true;
}

function circleIntersectsCircle(circle1, circle2) {
    const distSquared = Math.pow((circle1.x - circle2.x), 2) + Math.pow((circle1.y - circle2.y), 2);
    const radiiSquaredSum = Math.pow(circle1.r, 2) + Math.pow(circle2.r, 2);
    return distSquared <= radiiSquaredSum;
}

function rectIntersectsCircle(rect, circle) {
    const closestX = Math.max(rect.x1, Math.min(circle.x, rect.x2));
    const closestY = Math.max(rect.y1, Math.min(circle.y, rect.y2));
    const distSquared = Math.pow(closestX - circle.x, 2) + Math.pow(closestY - circle.y, 2);
    const radiusSquared = Math.pow(circle.r, 2);
    return distSquared <= radiusSquared;
}

class Rectangle {
    constructor(x1, y1, x2, y2) {
        this.x1 = Math.min(x1, x2);
        this.y1 = Math.min(y1, y2);
        this.x2 = Math.max(x1, x2);
        this.y2 = Math.max(y1, y2);
    }

    intersect(other) {
        if (other instanceof Rectangle) {
            return rectIntersectsRect(this, other);
        }
        if (other instanceof Circle) {
            return rectIntersectsCircle(this, other);
        }
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    intersect(other) {
        if (other instanceof Rectangle) {
            return rectIntersectsCircle(other, this);
        }
        if (other instanceof Circle) {
            return circleIntersectsCircle(this, other);
        }
    }
}

exports.Circle = Circle;
exports.Rectangle = Rectangle;