const joi = require("joi");

const validateRegisterUser = (user) => {
  const schema = joi.object({
    user_name: joi
      .string()
      .trim()
      .min(3)
      .pattern(/^[A-Za-z][A-Za-z 0-9_-]*$/)
      .required()
      .messages({
        "string.base": "Username must be a string.",
        "string.empty": "Username cannot be empty.",
        "string.min": "Username must be at least 3 characters long.",
        "string.pattern.base":
          "Username must start with a letter and can only contain letters, numbers, underscores, or hyphens.",
        "any.required": "Username is required.",
      }),

    email: joi
      .string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.base": "Email must be a string.",
        "string.empty": "Email cannot be empty.",
        "string.email": "Email must be a valid email address.",
        "any.required": "Email is required.",
      }),

    password: joi.string().min(8).required().messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });

  return schema.validate(user, { abortEarly: false });
};
const validateLoginUser = (user) => {
  const schema = joi.object({
    email: joi
      .string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.base": "Email must be a string.",
        "string.empty": "Email cannot be empty.",
        "string.email": "Email must be a valid email address.",
        "any.required": "Email is required.",
      }),

    password: joi.string().min(8).required().messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });

  return schema.validate(user, { abortEarly: false });
};

module.exports = { validateLoginUser, validateRegisterUser };
