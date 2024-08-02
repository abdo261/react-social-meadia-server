const formatError = (err) => {
  if (!err || !err.details) return {};

  const formattedErrors = {};

  err.details.forEach((detail) => {
    const path = detail.path[0];
    const message = detail.message;

    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }

    formattedErrors[path].push(message);
  });

  return formattedErrors;
};

module.exports = {formatError}