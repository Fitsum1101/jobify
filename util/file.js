const { unlink } = require("fs/promises");

module.exports = (filePath) => {
  return unlink(filePath);
};
