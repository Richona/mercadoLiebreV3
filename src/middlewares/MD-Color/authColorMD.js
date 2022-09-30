function authColorMiddleware (req, res, next){
    if(!req.session.colorLogged){
        return res.redirect("/color")
    }
    next()
}
module.exports = authColorMiddleware;