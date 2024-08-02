const Joi = require('joi');

const validateCreatePost = (post) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    description: Joi.string().min(3).optional(),
  });

  return schema.validate(post);
};

module.exports = validateCreatePost;
