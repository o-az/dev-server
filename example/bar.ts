export default class {
  constructor(public param: string = "barbar") {}

  public getParams = () =>
    JSON.stringify({ file: __filename, param: this.param }, null, 2);

  public getTimestamp = () =>
    JSON.stringify({ file: __filename, timestamp: Date.now() }, null, 2);
}
