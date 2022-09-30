function guestColorMiddleware (req, res, next){
    if(req.session.colorLogged){
        return res.redirect("/gracias")
    }
    next()
}
module.exports = guestColorMiddleware;