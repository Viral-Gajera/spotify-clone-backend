function invalidRouter(req, res) {
    res.json({
        message: "Invalid Router",
    });
}

module.exports = { invalidRouter };
