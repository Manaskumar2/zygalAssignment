const router = require("express").Router()




const { signUp, signIn } = require("../controller/userController")
const {createInput,getText,deleteText } = require("../controller/inputDataController")
const {authentication} = require("../controller/authMiddleWare/authMiddleware")
router.post("/SignUp",signUp)
router.post("/signIn", signIn)

router.post("/createText", authentication, createInput)

router.get("/getText", authentication, getText)
router.put("/deletetext",authentication,deleteText)
module.exports = router