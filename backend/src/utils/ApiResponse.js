export const success = (data, message = 'OK') => ({
  success: true,
  message,
  data,
})

export const failure = (message, code, details) => ({
  success: false,
  message,
  code,
  details,
})


