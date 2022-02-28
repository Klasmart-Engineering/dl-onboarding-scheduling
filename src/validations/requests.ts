import Joi from 'joi';

export const organizationsSchema = Joi.object({
  name: Joi.string().required(),
});
