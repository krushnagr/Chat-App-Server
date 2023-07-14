const notFound = (req,res,next) =>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const ErrorHandeler = (err ,req,res,next) =>{
    const statuscode = res.statusCode ===200 ? 500 : res.statusCode
    res.status(statuscode);
    res.json({
        message : err.message,
        stack : process.env.NODE_ENV === "production" ? null : err.stack
    })
}
module.exports = {notFound, ErrorHandeler}