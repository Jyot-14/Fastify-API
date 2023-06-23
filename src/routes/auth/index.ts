import { FastifyPluginAsync } from 'fastify';
import { LoginBody, LoginOpts, RegisterBody, RegisterOpts } from './types';
import * as bcrypt from 'bcrypt';

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: RegisterBody }>(
    '/register',
    RegisterOpts,
    async function (request, reply) {
      const { password } = request.body;

      const hash = await bcrypt.hash(password, 10);

      const user = new fastify.store.User({
        ...request.body,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // user.save((err, user) => {
      //   if (err || !user) {
      //     return Error('User cannot be inserted');
      //   }

      //   const token = fastify.generateJWT(user.email);
      //   return reply.status(201).send({ ...user, token });
      // });
      try {
        await user.save();
        const token = fastify.generateJWT(user.email);
        reply.status(201).send({ ...user.toObject(), token });
      } catch (err) {
        throw new Error('User cannot be inserted');
      }

      return reply;
    }
  );

  fastify.post<{ Body: LoginBody }>(
    '/login',
    LoginOpts,
    async function (request, reply) {
      const { email, password } = request.body;

      const user = await fastify.store.User.findOne({ email }).exec();
      if (!user) {
        return reply.status(404).send();
      }

      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err || !isValid) {
          return reply.getHttpError(401, 'invalid credentials');
        }

        const token = fastify.generateJWT(user.email);
        reply.status(200).send({ token, ...user.toObject() });
      });

      return reply;
    }
  );
};

export default example;
