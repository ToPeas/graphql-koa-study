const { formatError } = require('graphql');

module.exports = error => {
  const data = formatError(error);
  const { originalError } = error;
  // console.log(error)
  if (originalError) {
    delete data.locations;
    data.field = originalError.field;
    data.hint =  originalError.hint;
  }
  // console.log(data)
  return data;
};