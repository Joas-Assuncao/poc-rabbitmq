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

  fastify.decorate("rabbit", { connection, channel });

  fastify.addHook("onClose", async () => {
    await channel.close();
    await connection.close();
  });
});
