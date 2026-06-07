const formatErrors = (zodError) =>
  (zodError?.issues ?? []).map((issue) => ({
    field: issue.path.join(".") || "value",
    message: issue.message,
  }));

const makeValidator = (source, errorMessage) => (schema) => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({ message: errorMessage, errors: formatErrors(result.error) });
  }
  req[source] = result.data;
  next();
};

const validate = makeValidator("body", "Validation failed");
const validateParams = makeValidator("params", "Invalid route parameters");
const validateQuery = makeValidator("query", "Invalid query parameters");

module.exports = { validate, validateParams, validateQuery };
