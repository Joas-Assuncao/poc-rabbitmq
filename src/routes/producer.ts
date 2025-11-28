import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance) {
  fastify.post("/send", async (req, reply) => {
    const queue = "poc_queue";

    const channel = fastify.rabbit.channel;

    const msg = {
      body: req.body,
      text: "Hello RabbitMQ",
      date: new Date(),
    };

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    return { sent: true, msg };
  });
}
