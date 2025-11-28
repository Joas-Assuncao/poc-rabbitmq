import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance) {
  fastify.post("/send", async (req, reply) => {
    // configurações pra quando não é exchange
    // const queue = "poc_queue";
    // const channel = fastify.rabbit.channel;

    const message = {
      body: req.body,
      text: "Hello from exchange",
      date: new Date(),
    };

    fastify.rabbit.channel.publish(
      "poc-exchange",
      "poc.key",
      Buffer.from(JSON.stringify(message))
    )

    return { status: "Message sent!", message };
  });
}
