const { data } = require("../project.json");
exports.handler = async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
