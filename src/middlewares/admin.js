export function ensureAdmin(req, res, next) {
	if (req.session?.user?.role === 'admin') return next();
	return res.status(403).render('404', { title: 'Forbidden' });
}

export default { ensureAdmin };

