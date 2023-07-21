const express = require("express");
const {Router} = express;

const userRouter = require("./users");
const patientRouter = require("./patients");
const sensorsRouter = require("./sensors");

const router = new Router();

var cors = require('cors');
router.use(cors());

router.use("/users", userRouter);
router.use("/patients", patientRouter);
router.use("/sensors", sensorsRouter);

module.exports = router;