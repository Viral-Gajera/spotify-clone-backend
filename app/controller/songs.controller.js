let DB = require("../model/database");

async function getAllSong(req, res) {
    let dbResult = await DB.execute("SELECT * FROM song_table");
    dbResult = dbResult[0];

    if (dbResult.length) {
        res.json({
            isSuccess: true,
            message: "",
            data: dbResult,
        });
    } else {
        res.json({
            isSuccess: false,
            message: "fail to fetch songs",
            data: {},
        });
    }
}

async function isLikedSong(req, res) {
    let dbResult = await DB.execute(
        "SELECT * FROM playlist_table WHERE email=? AND song_id=?",
        [req.body.email, req.body.songId]
    );
    dbResult = dbResult[0];

    if (dbResult.length) {
        res.json({
            isSuccess: true,
            message: "Song is liked",
            data: dbResult,
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Song is not liked",
            data: {},
        });
    }
}

async function likedSong(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "INSERT INTO playlist_table (`email`, `song_id`) VALUES (?, ?)",
        [req.body.email, req.body.songId]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        res.json({
            isSuccess: true,
            message: "Song liked Successfully",
            data: {},
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function unlikedSong(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "DELETE FROM playlist_table WHERE email=? AND song_id=?",
        [req.body.email, req.body.songId]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        res.json({
            isSuccess: true,
            message: "Song unliked Successfully",
            data: {},
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function getPlaylist(req, res) {
    let dbResult = await DB.execute(
        "SELECT * FROM playlist_table WHERE email=?",
        [req.body.email]
    );
    dbResult = dbResult[0];

    if (dbResult.length) {
        let songIds = [];
        dbResult.forEach((element) => {
            songIds.push(element.song_id);
        });

        let songIdsString = songIds.join(",");
        dbResult = await DB.execute(
            `SELECT * FROM song_table WHERE song_id IN (${songIdsString})`
        );
        dbResult = dbResult[0];

        if (dbResult.length) {
            res.json({
                isSuccess: true,
                message: "",
                data: dbResult,
            });
        } else {
            res.json({
                isSuccess: false,
                message: "fail to fetch songs",
                data: {},
            });
        }
    } else {
        res.json({
            isSuccess: false,
            message: "fail to fetch songs",
            data: {},
        });
    }
}

module.exports = {
    getAllSong,
    isLikedSong,
    likedSong,
    unlikedSong,
    getPlaylist,
};
