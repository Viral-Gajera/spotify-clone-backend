let DB = require("../model/database");
let joi = require("joi");
let jwt = require("jsonwebtoken");

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

async function validateToken(req, res, next) {
    try {
        let result = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);

        let dbResult = await DB.execute(
            `SELECT * FROM user_table WHERE email='${result.email}' AND password='${result.password}'`
        );
        dbResult = dbResult[0];

        if (dbResult.length) {
            res.json({
                isSuccess: true,
                message: "Token is valid",
                data: {},
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Invalid token",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: "Invalid token",
            data: {},
        });
    }
}

async function login(req, res) {
    let validate = (body) => {
        let schema = joi.object({
            email: joi.string().email().required(),
            password: joi
                .string()
                .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
                .required(),
        });

        return schema.validate(body);
    };

    let { error } = validate(req.body);

    if (error) {
        res.json({
            isSuccess: false,
            message: error.details[0]["message"],
            data: {},
        });
    }

    let dbResult = await DB.execute(
        `SELECT * FROM user_table WHERE email='${req.body.email}' AND password='${req.body.password}'`
    );
    dbResult = dbResult[0];

    if (dbResult.length) {
        let token = generateToken({
            email: req.body.email,
            password: req.body.password,
        });
        res.json({
            isSuccess: true,
            message: "Login Successful",
            data: {
                firstname: dbResult[0]["first_name"],
                email: dbResult[0]["email"],
                token: token,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Invalid Email or Password",
            data: {},
        });
    }
}

async function createAccount(req, res) {
    let validate = (body) => {
        let schema = joi.object({
            firstname: joi.string().min(3).required(),
            lastname: joi.string().min(3).required(),
            email: joi.string().email().required(),
            password: joi
                .string()
                .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
                .required(),
        });

        return schema.validate(body);
    };

    let { error } = validate(req.body);

    if (error) {
        res.json({
            isSuccess: false,
            message: error.details[0]["message"],
            data: {},
        });
    }

    // Check if email address already exists
    let dbResult = await DB.execute(
        `SELECT * FROM user_table WHERE email='${req.body.email}'`
    );
    dbResult = dbResult[0];

    if (dbResult.length) {
        res.json({
            isSuccess: false,
            message: "Email address already exists",
            data: {},
        });
    } else {
        // Insert data into database
        dbResult = await DB.execute(
            "INSERT INTO user_table (`first_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?)",
            [
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                req.body.password,
            ]
        );
        dbResult = dbResult[0];

        // Check if data inserted successfully or not and send response accordingly
        if (dbResult.affectedRows) {
            let token = generateToken({
                email: req.body.email,
                password: req.body.password,
            });
            res.json({
                isSuccess: true,
                message: "Account Created Successfully",
                data: {
                    firstname: req.body.firstname,
                    token: token,
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message:
                    "Somthing went wrong while inserting data into database",
                data: {},
            });
        }
    }
}

async function validateadmin(req, res) {
    let validate = (body) => {
        let schema = joi.object({
            email: joi.string().email().required(),
            password: joi
                .string()
                .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
                .required(),
        });

        return schema.validate(body);
    };

    let { error } = validate(req.body);

    if (error) {
        res.json({
            isSuccess: false,
            message: error.details[0]["message"],
            data: {},
        });
        return;
    }

    let dbResult = await DB.execute(
        `SELECT * FROM admin_table WHERE email='${req.body.email}' AND password='${req.body.password}'`
    );
    dbResult = dbResult[0];

    if (dbResult.length) {
        let token = generateToken({
            email: req.body.email,
            password: req.body.password,
        });
        res.json({
            isSuccess: true,
            message: "Login Successful",
            data: {
                firstname: dbResult[0]["first_name"],
                token: token,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Invalid Email or Password",
            data: {},
        });
    }
}

async function validateAdminToken(req, res, next) {
    try {
        let result = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);

        let dbResult = await DB.execute(
            `SELECT * FROM admin_table WHERE email='${result.email}' AND password='${result.password}'`
        );
        dbResult = dbResult[0];

        if (dbResult.length) {
            res.json({
                isSuccess: true,
                message: "Token is valid",
                data: {},
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Invalid token",
                data: {},
            });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createAccount,
    login,
    validateToken,
    validateadmin,
    validateAdminToken,
};
