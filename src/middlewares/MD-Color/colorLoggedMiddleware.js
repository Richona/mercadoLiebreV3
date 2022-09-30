function colorLoggedMiddleware(req,res,next) {
    res.locals.colorLogged = false;
    let colorInCookie = req.cookies.color

    if (colorInCookie) {
        req.session.colorLogged = colorInCookie
    }
    if (req.session.colorLogged) {
        res.locals.colorIsLogged = true;
        res.locals.colorLogged = req.session.colorLogged;
    }

    next();
}

module.exports = colorLoggedMiddleware