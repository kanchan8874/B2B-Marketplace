import { StatusCodes } from 'http-status-codes'

export const validateRequest = (schema) => (req, res, next) => {
  const payload = {
    body: req.body,
    query: req.query,
    params: req.params,
  }

  const { error, value } = schema.validate(payload, { abortEarly: false, allowUnknown: true })

  if (error) {
    return next({
      name: 'ValidationError',
      details: error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      })),
      statusCode: StatusCodes.BAD_REQUEST,
    })
  }

  req.body = value.body
  req.query = value.query
  req.params = value.params
  return next()
}


