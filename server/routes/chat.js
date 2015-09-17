exports.get = function (req, res) {
    var io = req.app.get('io');
    var user = req.session.passport.user.user_id;
    res.render('chat', {user:user});
};