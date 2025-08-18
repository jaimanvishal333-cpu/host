export function notFound(req, res) {
	return res.status(404).render('404', { title: 'Not Found' });
}

export function errorHandler(err, req, res, next) {
	// eslint-disable-next-line no-console
	console.error(err);
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	if (req.accepts('html')) {
		return res.status(status).render('404', { title: `${status}`, message });
	}
	return res.status(status).json({ error: message });
}

export default { notFound, errorHandler };

