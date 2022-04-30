const db = require('../knex/knex');
const {v4: uuid} = require('uuid');

//var token = 00000000-0000-0000-0000-000000000000;

// authentication
const signUser = async(req,res) => {

    if(await findIfUserDetailsAreCorrect(req.params.username,req.params.token))
    {
        req.session.token = req.params.token;
        res.json({
            "message" : "User " + req.params.username + " has been authenticated"
        })
    }
    else 
    {
        res.json({
            "message" : "User " + req.params.username + " does not exist or the token provided seems to be incorrect"
        })   
    }
}
const registerUser = async(req,res) => {
    // register user and generate token
    const token = uuid();
    if(! await findUser(req.params.username))
    {
        const result = await db('users').insert({
            user_name : req.params.username,
            token_key : token
        }).returning('*');

        console.log(result);
        req.session.token = token;
        res.json({
            "message": req.params.username + " User Registered",
            "token" : token
        });
    }
    else 
    {
        res.json({
            "message": req.params.username + " already present",
        });   
    }
}


// API routes
const findBudgetHomes = async(req,res) => {
    if(req.params.token == req.session.token)
    {
        const result = await findHomesByMinPriceByMaxPrice(req.params.maxPrice,req.params.minPrice);
        res.json(result);
    }
    else 
    {
        res.json({
            "message": "User is not authenticated or token seems to be incorrect"
        });
    }
}
const findMinSqft = async(req,res) => {
    if(req.params.token == req.session.token)
    {
        const result = await findHomesByMinSqft(req.params.minSqft);
        res.json(result);
    }
    else 
    {
        res.json({
            "message": "User is not authenticated or token seems to be incorrect"
        });
    }
}

const findHomebyYear = async(req,res) => {
    if(req.params.token == req.session.token)
    {
        const result = await findHomesByYearBuiltOrRenovated(req.params.year);
        res.json(result);
    }
    else 
    {
        res.json({
            "message": "User is not authenticated or token seems to be incorrect"
        });
    }
}

module.exports = {findBudgetHomes,findMinSqft,findHomebyYear,signUser,registerUser};

// User related functions 

const findUser = async(user_name) => {
    const users = await db('users').select('user_name');
    for(var user in users)
    {
        if(users[user].user_name == user_name)
            return true;
    }
    return false;
}

const findIfUserDetailsAreCorrect = async(user_name,token) => {
    const users = await db('users').select('user_name','token_key');
    for(var user in users)
    {
        if(users[user].user_name == user_name && users[user].token_key == token)
        {
            return true;
        }
    }
    return false;
}


// API functions
const findHomesByYearBuiltOrRenovated = async(year) => {
    const results = await db('house_table').where('yr_built','>',year).orWhere('yr_renovated','>',year);
    return results;
}

const findHomesByMinSqft = async(min_sqft) => {
    const results = await db('house_table').where('sqft_living','>',min_sqft);
    return results;
}

const findHomesByMinPriceByMaxPrice = async(min_price,max_price) => {
    const results = await db('house_table').where('price','>',min_price).andWhere('price','<',max_price);
    return results;
}