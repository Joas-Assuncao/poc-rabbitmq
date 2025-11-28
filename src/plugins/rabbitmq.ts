import fp from "fastify-plugin";
import * as amqp from "amqplib";

export interface RabbitMQPluginOptions {
  url: string;
}

declare module "fastify" {
  interface FastifyInstance {
    rabbit: {
      connection: amqp.ChannelModel;
      channel: amqp.Channel;
    };
  }
}

export default fp<RabbitMQPluginOptions>(async (fastify, opts) => {
  const connection = await amqp.connect(opts.url);
  const channel = await connection.createChannel();

  // Declarar exchange
  await channel.assertExchange("poc-exchange", "direct", {durable: true});

  // Declarar queue
  await channel.assertQueue("poc-queue", { durable: true })

  // Bind queue to exchange
  await channel.bindQueue("poc-queue", "poc-exchange", "poc.key")

  fastify.decorate("rabbit", { connection, channel });

  fastify.addHook("onClose", async () => {
    await channel.close();
    await connection.close();
  });
});
