import { FastifyInstance } from "fastify";

export async function startConsumer(fastify: FastifyInstance) {
  // o que está comentado é config para quando não é exchange

  // const queue = "poc_queue";

  const channel = fastify.rabbit.channel;

  // await channel.assertQueue(queue, { durable: false });

  console.log("[*] Waiting for messages...");

  channel.consume(
    "poc-queue",
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log("[x] Received:", content);

        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}
