function debugPrint(message) {
  if ((process.env.DEBUG)) console.log(message);
}
module.exports = debugPrint;
