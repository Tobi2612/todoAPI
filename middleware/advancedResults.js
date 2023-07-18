const advancedResults = (model) => async (req, res, next) => {
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //fields to exclude
    const removeFields = ['page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);


    //create query string
    let queryStr = JSON.stringify(reqQuery);


    query = model.find(JSON.parse(queryStr)).where('user').equals(req.user.id).select('-user');
    query = query.sort('-createdAt');

    
    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();



    query = query.skip(startIndex).limit(limit);


    const results = await query;

    //pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults