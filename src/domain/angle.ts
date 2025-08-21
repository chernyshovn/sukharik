export default class Angle {
  private _rad: number;
  private _deg: number | null = null;
  private _sin: number | null = null;
  private _cos: number | null = null;
  private _tan: number | null = null;

  private constructor(rad: number) {
    this._rad = rad;
  }

  public static fromDeg(deg: number): Angle {
    return new Angle(deg * Math.PI / 180);
  }

  public static fromRad(rad: number): Angle {
    return new Angle(rad);
  }

  public get rad() : number {
    return this._rad;
  }

  public get deg(): number {
    if (this._deg === null) {
      this._deg = this.rad * 180 / Math.PI;
    }
    return this._deg;
  }

  public get sin(): number {
    if (this._sin === null) {
      this._sin = Math.sin(this.rad);
    }
    return this._sin;
  }

  public get cos(): number {
    if (this._cos === null) {
      this._cos = Math.cos(this.rad);
    }
    return this._cos;
  }

  public get tan(): number {
    if (this._tan === null) {
      this._tan = Math.tan(this.rad);
    }
    return this._tan;
  }
}
