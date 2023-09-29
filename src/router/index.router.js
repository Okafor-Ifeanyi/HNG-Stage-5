import express from 'express'
const router = express.Router()

  
// Member CRUD Operation
router.post("/upload", validate(memberSchema), register);
router.post("/login", validate(loginMember), login);
router.get("/", isAuth, getMyProfile);

exports = router;