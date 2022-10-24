const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const passport = require('passport')
const { config } = require('../../middlewares/config.js')
const authChecker = require('../../middlewares/authorization.js')

router.get("/home", /*authChecker.checkNotAuthenticated, config.global(),*/ (req, res) => {
    res.render("index", { user: req.user })
})
router.get("/login", authChecker.checkAuthenticated, (req, res) => {
    res.render("login", { message: req.flash('error') })
})
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
    })
)
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router