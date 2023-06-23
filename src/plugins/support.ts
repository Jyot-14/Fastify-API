import fp from 'fastify-plugin';
import { User, UserSchema } from '../schemas';
import fastifyJwt from '@fastify/jwt';
import * as mongoose from 'mongoose';
import { fastifyRequestContextPlugin } from '@fastify/request-context';

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: 'supersecret',
    sign: {
      expiresIn: '15 minutes',
    },
  });

  fastify.register(fastifyRequestContextPlugin);

  fastify.decorate('generateJWT', (email: string) => {
    return fastify.jwt.sign({ email });
  });

  const db = await mongoose
    .connect(
      'mongodb+srv://jyot:jyot@cluster0.arwrfbv.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'myDB' }
    )
    .then(conn => {
      fastify.decorate('store', {
        User: conn.model('User', UserSchema),
        db: conn,
      });

      return conn;
    })
    .catch(console.error);

  if (!db) throw new Error('Cannot connect to database');
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    generateJWT: (email: string) => string;
    store: {
      User: mongoose.Model<User>;
      db: typeof mongoose;
    };
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    user: User;
  }
}
