class APIFilters{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }
    search(){
    const keyword = this.queryStr.keyword
    ?{
        name:{
            $regex: this.queryStr.keyword,
            $options:"i",
        },
    }
    :{};
    this.query = this.query.find({...keyword});
    return this;
}

filters() {
  const queryCopy = { ...this.queryStr }

  // Remove non-filter fields
  const removeFields = ['keyword', 'page']
  removeFields.forEach(el => delete queryCopy[el])

  const mongoQuery = {}

  for (let key in queryCopy) {
    if (key.includes('[')) {
      const [field, operator] = key.split('[')
      const mongoOperator = `$${operator.replace(']', '')}`

      mongoQuery[field] = {
        [mongoOperator]: Number(queryCopy[key])
      }
    } else {
      mongoQuery[key] = queryCopy[key]
    }
  }
 
  this.query = this.query.find(mongoQuery)
  return this
}



pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
export default APIFilters

