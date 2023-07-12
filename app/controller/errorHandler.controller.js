function errorHandler(err, req, res, next) {
    res.set("status", "500");
    res.json({
        status: "failed",
        message: `${err.message}`,
        callstack: `${err.callstack}`,
    });
}

module.exports = { errorHandler };
