function getPagination(query = {}) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;
  return { limit, skip };
}
module.exports = getPagination;
