const authMiddleware = {
  checkAuthentication(req, res, next) {
    // can use req.isAuthenticated() for this too..
    if (!req.user) {
      req.flash('loginMessage', "Please login")
      return res.redirect('/auth/login');
    }
    else {
     return next();
    }
  },
  currentUser(req, res, next) {
    // if the user is authenticated (passport method returns true when serialized)
    if (req.isAuthenticated()) {
      // this is available in the view for all requests, deserializing FTW
      res.locals.currentUser = req.user;
      return next();
    }
    else {
      return next();
    }
  },
  preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.redirect(`/users/${req.user.id}`);
    }
    else {
     return next();
    }
  },
  ensureAdmin(req,res,next){
    if (req.user.isadmin === false) {
      return res.redirect('/')
    }
    else {
      return next();
    }
  },
  ensureCorrectUser(req,res,next){
    if(req.user.isadmin || (+req.params.id === req.user.id)){
      return next();
    }
    else {
      return res.redirect(`/`)
    }
  },
  ensureCorrectUserForPoster(req,res,next){
    if(+req.params.user_id !== req.user.id){
      return res.redirect(`/users/${req.user.id}`)
    }
    else {
      return next();
    }
  }
};
module.exports = authMiddleware;
