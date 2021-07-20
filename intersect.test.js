const Circle = require('./intersect').Circle;
const Rectangle = require('./intersect').Rectangle;

test('r1 to the left of r2 does not intersect', () => {
    expect(new Rectangle(0, 0, 20, 20).intersect(new Rectangle(25, 0, 35, 20))).toBe(false);
});

test('r1 to the right of r2 does not intersect', () => {
    expect(new Rectangle(25, 0, 35, 20).intersect(new Rectangle(0, 0, 20, 20))).toBe(false);
});

test('r1 above r2 does not intersect', () => {
    expect(new Rectangle(0, 25, 25, 50).intersect(new Rectangle(0, 0, 25, 20))).toBe(false);
});

test('r1 below r2 does not intersect', () => {
    expect(new Rectangle(0, 0, 25, 20).intersect(new Rectangle(0, 25, 25, 50))).toBe(false);
});

test('rect intersects self', () => {
    const rect = new Rectangle(0, 0, 25, 25);
    expect(rect.intersect(rect)).toBe(true);
});

test('r1 inside r2 intersects', () => {
    expect(new Rectangle(0, 0, 20, 20).intersect(new Rectangle(5, 5, 10, 10))).toBe(true);
});

test('r1 with right edge inside r2 intersects', () => {
    expect(new Rectangle(0, 0, 20, 20).intersect(new Rectangle(10, 0, 30, 30))).toBe(true);
});

test('r1 with left edge inside r2 intersects', () => {
    expect(new Rectangle(10, 0, 30, 30).intersect(new Rectangle(0, 0, 20, 20))).toBe(true);
});

test('c1 does not intersect c2', () => {
    expect(new Circle(0, 0, 1).intersect(new Circle(5, 5, 1))).toBe(false);
});

test('c1 intersects c2', () => {
    expect(new Circle(0, 0, 5).intersect(new Circle(2, 2, 1))).toBe(true);
});

test('c1 and c2 intersect at single point', () => {
    expect(new Circle(0, 0, 1).intersect(new Circle(1, 0, 1))).toBe(true);
});

test('circle inside rectangle intersects', () => {
    expect(new Circle(0, 0, 1).intersect(new Rectangle(-5, -5, 5, 5))).toBe(true);
});

test('rectangle inside circle intersects', () => {
    expect(new Rectangle(-1, -1, 1, 1).intersect(new Circle(0, 0, 5))).toBe(true);
});