const admins = ["richard@gmail.com", "sirley@gmail.com","matias@gmail.com","daniel@gmail.com"]
function adminMiddleware (req, res, next){
    admins.forEach(admin => {
        if(req.session.userLogged.email === admin){
            return next()
        }
    });
    return res.send("No eres admin")
}
module.exports = adminMiddleware;