import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";

const routes = async (
  instance: FastifyInstance,
  options: FastifyPluginOptions
) => {
  instance.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ message: "Olá, mundo" });
  });
};

export default routes;
