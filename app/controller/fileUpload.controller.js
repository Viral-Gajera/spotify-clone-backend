let multer = require("multer");
let DB = require("../model/database");
let joi = require("joi");

// MULTER SETUP
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "songThumbnail") {
            // cb(null, `${__dirname}/app/model/images/`);
            cb(null, `./app/model/images/`);
        } else if (file.fieldname === "songFile") {
            // cb(null, `${__dirname}/app/model/audios/`);
            cb(null, `./app/model/audios/`);
        }
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname.split(".");
        cb(null, Date.now() + "." + fileName[fileName.length - 1]);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.fieldname === "songThumbnail" &&
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    } else if (
        file.fieldname === "songFile" &&
        file.mimetype.startsWith("audio/")
    ) {
        cb(null, true);
    } else {
        throw new Error(
            "Form Data should only contain songThumbnail and songFile Fields"
        );
    }
};

// MULTER INSTANCE
let upload = multer({ storage: storage, fileFilter: fileFilter });

// MIDDLWARE FOR MULTER
let uploadMiddleware = upload.fields([
    { name: "songThumbnail", maxCount: 1 },
    { name: "songFile", maxCount: 1 },
]);

async function uploadHandler(req, res) {
    let validate = (body) => {
        let schema = joi.object({
            songName: joi.string().min(3).required(),
            artistName: joi.string().min(3).required(),
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

    let songThumbnailURL = `/image/${req.files["songThumbnail"][0].filename}`;
    let songFileURL = `/audio/${req.files["songFile"][0].filename}`;

    let dbResult = await DB.execute(
        "INSERT INTO song_table (`song_name`, `song_artist`, `song_thumbnail_url`, `song_file_url`) VALUES (?, ?, ?, ?)",
        [req.body.songName, req.body.artistName, songThumbnailURL, songFileURL]
    );
    dbResult = dbResult[0];
    console.log(dbResult);

    if (dbResult.affectedRows) {
        res.status(200);
        res.json({
            isSuccess: true,
            message: "File uploaded successfully",
        });
    } else {
        res.status(500);
        res.json({
            isSuccess: false,
            message: "Something went wrong while uploading file",
        });
    }
}

module.exports = { uploadMiddleware, uploadHandler };
