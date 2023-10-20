import url from "node:url";
import path from "node:path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

export default class {
  constructor(public param: string = "fooo") {}

  public getParams = () =>
    JSON.stringify({ file: __filename, param: this.param }, null, 2);

  public getTimestamp = () =>
    JSON.stringify({ file: __filename, timestamp: Date.now() }, null, 2);
}
