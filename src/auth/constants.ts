import config from '../../config/configuration';

export const jwtConstants = {
  secret: config().secret,
};
