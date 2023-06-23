import { Type, Static } from '@sinclair/typebox';
import { RouteShorthandOptions } from 'fastify';

const RegisterRequest = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

const RegisterResponse = Type.Object({
  token: Type.String(),
  name: Type.String(),
  email: Type.String(),
});

export const RegisterOpts: RouteShorthandOptions = {
  schema: {
    body: RegisterRequest,
    response: {
      201: RegisterResponse,
    },
  },
};

export type RegisterBody = Static<typeof RegisterRequest>;

const LoginRequest = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export const LoginOpts: RouteShorthandOptions = {
  schema: {
    body: LoginRequest,
    response: {
      200: RegisterResponse,
    },
  },
};

export type LoginBody = Static<typeof LoginRequest>;
