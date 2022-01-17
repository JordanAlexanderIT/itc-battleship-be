function calculateTimeInMS(minutes, seconds) {
  const ms = (minutes * 60 + seconds) * 1000;
  return ms;
}
module.exports = { calculateTimeInMS };
