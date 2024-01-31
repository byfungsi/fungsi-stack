import { Server, createServer } from "http";
import path from "path";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port, dir: path.join(__dirname, "..") });
const handle = app.getRequestHandler();

let server: Server;

const waitServer = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve: any) => {
    await app.prepare();
    server = createServer(async (req: any, res: any) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        resolve(true);
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  });

export async function setup() {
  if (process.env.NO_SERVER) {
    return;
  }
  await waitServer();
}

export async function teardown() {
  if (server) {
    server.close();
  }
}
