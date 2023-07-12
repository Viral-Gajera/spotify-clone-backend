let express = require("express");
let router = express.Router();

// Import Controllers
let authenticationController = require("../controller/authentication.controller");
let songsController = require("../controller/songs.controller");
let fileUploadController = require("../controller/fileUpload.controller");
let invalidRouterController = require("../controller/invalidRouter.controller");
let errorHandlerController = require("../controller/errorHandler.controller");

// User login & signup
router.post("/api/createaccount", authenticationController.createAccount);
router.post("/api/login", authenticationController.login);
router.post("/api/validatetoken", authenticationController.validateToken);

// get all songs
router.get("/api/allsongs", songsController.getAllSong);
router.post("/api/islikedsong", songsController.isLikedSong);
router.post("/api/likesong", songsController.likedSong);
router.post("/api/unlikesong", songsController.unlikedSong);
router.post("/api/playlist", songsController.getPlaylist);

// Admin login
router.post("/api/validateadmin", authenticationController.validateadmin);
router.post("/api/validate-admin-token", authenticationController.validateAdminToken);

// File upload
router.post("/api/upload-song", fileUploadController.uploadMiddleware, fileUploadController.uploadHandler);

router.all("/*", invalidRouterController.invalidRouter);
router.use(errorHandlerController.errorHandler);

module.exports = router;
