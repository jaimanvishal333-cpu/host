export function ensureAuthenticated(req, res, next) {
	if (req.session && req.session.user) return next();
	req.session.returnTo = req.originalUrl;
	return res.redirect('/auth/login');
}

export function attachUserToLocals(req, res, next) {
	res.locals.currentUser = req.session?.user || null;
	next();
}

export default { ensureAuthenticated, attachUserToLocals };

