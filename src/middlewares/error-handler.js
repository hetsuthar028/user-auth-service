module.exports =  errorHandler = (err, req, res, next) => {
    console.log("Something went wrong");
    res.status(400).send({
        status: "error",
        message: "Something went wrong"
    })
    next();
}