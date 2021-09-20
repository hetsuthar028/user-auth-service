module.exports =  errorHandler = (err, req, res, next) => {
    if(err){
        console.log("**Error**", err.message);
    }
    next();
}