import dotenv from "dotenv";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { VercelRequest, VercelResponse } from "@vercel/node";
import routes from "./routes.js";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = fastify({ logger: true });

server.register(fastifyCors);
server.register(routes);

const handler = async (request: VercelRequest, response: VercelResponse) => {
  await server.ready();
  server.server.emit("request", request, response);
};

server.listen({ port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando na porta ${address}`);
});

export default handler;
