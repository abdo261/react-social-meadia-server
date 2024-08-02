const Joi = require("joi");

const validateCreateComment = (comment) => {
  const schema = Joi.object({
    content: Joi.string().trim().min(3).required(),
  });

  return schema.validate(comment);
};

module.exports = validateCreateComment;
