export default class Point {
  constructor(public x: number, public y: number) {}

  public addPoint(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  public addXY(x: number, y: number): Point {
    return new Point(this.x + x, this.y + y);
  }

  public addX(x: number): Point {
    return new Point(this.x + x, this.y);
  }

  public addY(y: number): Point {
    return new Point(this.x, this.y + y);
  }

  public distTo(p: Point): number {
    return Math.hypot(this.x - p.x, this.y - p.y);
  }

  public reflectOX(yShift: number = 0) {
    return new Point(this.x, 2 * yShift - this.y);
  }
}