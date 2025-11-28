import { FastifyPluginAsync } from "fastify";

import { startConsumer } from "../consumer";
import rabbitMQPlugin from "../plugins/rabbitmq";
import producerRoutes from "./producer";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  await fastify.register(rabbitMQPlugin, {
    url: "amqp://localhost",
  });

  fastify.register(producerRoutes, { prefix: "/rabbit" });

  fastify.ready().then(() => startConsumer(fastify));
};

export default root;
