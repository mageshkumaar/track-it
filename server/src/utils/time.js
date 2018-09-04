/**
 * Returns the current time in ISO 8601 format
 */
const currentTime = () => {
  return new Date(Date.now()).toISOString()
}

module.exports = {
  currentTime
}
