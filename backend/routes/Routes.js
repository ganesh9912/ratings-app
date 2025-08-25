const express = require("express");
const { register } = require("../controllers/ratingcontroller");
const { login,users, Addstore, stores, addOrUpdateRating, getUserRatings, getTotalRatings,getOwnerStores,updateOwnerPassword, updateUserPassword, removeUserRating} = require("../controllers/ratingcontroller");
const router = express.Router();

router.get('/users', users);
router.get('/ratings/user/:id', getUserRatings);
router.get("/stores/:ownerId", getOwnerStores);
router.get("/ratings/count", getTotalRatings);


router.get('/stores', stores);

router.post('/register', register);

router.post('/login',login);

router.post('/Addstore' ,Addstore);

router.post('/ratings',addOrUpdateRating);

router.put("/owner/updatepassword/:id", updateOwnerPassword);

router.put("/user/updatepassword/:id", updateUserPassword);

router.delete("/ratings/:userId/:storeId", removeUserRating);

module.exports = router;