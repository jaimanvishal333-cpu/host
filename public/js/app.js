(function () {
	async function api(path, options = {}) {
		const res = await fetch(path, {
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		if (!res.ok) {
			let errText = 'Request failed';
			try {
				const j = await res.json();
				errText = j.error || errText;
			} catch {}
			throw new Error(errText);
		}
		try {
			return await res.json();
		} catch {
			return null;
		}
	}

	function $(sel) { return document.querySelector(sel); }
	function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

	async function refreshNav() {
		try {
			const me = await api('/api/me');
			const navDashboard = $('#nav-dashboard');
			const navLogin = $('#nav-login');
			const navRegister = $('#nav-register');
			const navLogout = $('#nav-logout');
			if (me && me.id) {
				if (navDashboard) navDashboard.classList.remove('hide');
				if (navLogin) navLogin.classList.add('hide');
				if (navRegister) navRegister.classList.add('hide');
				if (navLogout) navLogout.classList.remove('hide');
			} else {
				if (navDashboard) navDashboard.classList.add('hide');
				if (navLogin) navLogin.classList.remove('hide');
				if (navRegister) navRegister.classList.remove('hide');
				if (navLogout) navLogout.classList.add('hide');
			}
		} catch {}
	}

	// Domain check on homepage
	on($('#domain-check-form'), 'submit', async (e) => {
		e.preventDefault();
		const domain = $('#domain-input').value.trim();
		const result = $('#domain-check-result');
		result.textContent = 'Checking...';
		try {
			const data = await api(`/api/domain/check?domain=${encodeURIComponent(domain)}`);
			if (data.available) {
				result.textContent = `${data.domain} is available!`;
				result.classList.remove('muted');
			} else {
				result.textContent = `${data.domain} is not available.`;
			}
		} catch (err) {
			result.textContent = err.message || 'Failed to check domain';
		}
	});

	// Auth: register
	on($('#register-form'), 'submit', async (e) => {
		e.preventDefault();
		const name = $('#reg-name').value.trim();
		const email = $('#reg-email').value.trim();
		const password = $('#reg-password').value;
		const errEl = $('#register-error');
		errEl.textContent = '';
		try {
			await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
			window.location.href = '/dashboard.html';
		} catch (err) {
			errEl.textContent = err.message;
		}
	});

	// Auth: login
	on($('#login-form'), 'submit', async (e) => {
		e.preventDefault();
		const email = $('#login-email').value.trim();
		const password = $('#login-password').value;
		const errEl = $('#login-error');
		errEl.textContent = '';
		try {
			await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
			window.location.href = '/dashboard.html';
		} catch (err) {
			errEl.textContent = err.message;
		}
	});

	// Logout
	on($('#nav-logout'), 'click', async () => {
		try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
		window.location.href = '/';
	});

	// Contact form
	on($('#contact-form'), 'submit', async (e) => {
		e.preventDefault();
		const name = $('#contact-name').value.trim();
		const email = $('#contact-email').value.trim();
		const message = $('#contact-message').value.trim();
		const out = $('#contact-result');
		out.textContent = '';
		try {
			await api('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) });
			out.textContent = 'Thanks! We will reach out shortly.';
			$('#contact-form').reset();
		} catch (err) {
			out.textContent = err.message;
		}
	});

	// Checkout form
	(function initCheckout() {
		const form = $('#checkout-form');
		if (!form) return;
		const params = new URLSearchParams(location.search);
		const plan = params.get('plan') || 'Basic';
		const planEl = $('#checkout-plan');
		if (planEl) planEl.textContent = plan;
		on(form, 'submit', async (e) => {
			e.preventDefault();
			const domain = $('#checkout-domain').value.trim();
			const out = $('#checkout-result');
			out.textContent = '';
			try {
				await api('/api/orders', { method: 'POST', body: JSON.stringify({ plan, domain }) });
				out.textContent = 'Order placed! Go to your dashboard.';
				form.reset();
			} catch (err) {
				out.textContent = err.message;
			}
		});
	})();

	// Support ticket form
	on($('#ticket-form'), 'submit', async (e) => {
		e.preventDefault();
		const subject = $('#ticket-subject').value.trim();
		const message = $('#ticket-message').value.trim();
		const out = $('#ticket-result');
		out.textContent = '';
		try {
			await api('/api/tickets', { method: 'POST', body: JSON.stringify({ subject, message }) });
			out.textContent = 'Ticket submitted!';
			$('#ticket-form').reset();
		} catch (err) {
			out.textContent = err.message;
		}
	});

	// Dashboard data
	(async function initDashboard() {
		const ordersTable = $('#orders-table-body');
		const ticketsTable = $('#tickets-table-body');
		if (!ordersTable && !ticketsTable) return;
		try {
			const me = await api('/api/me');
			if (!me) { window.location.href = '/login.html'; return; }
			if (ordersTable) {
				const orders = await api('/api/orders');
				ordersTable.innerHTML = orders.map(o => `
					<tr>
						<td>${o.order_ref}</td>
						<td>${o.plan}</td>
						<td>${o.domain || '-'}</td>
						<td>${o.status}</td>
						<td>${new Date(o.created_at).toLocaleString()}</td>
					</tr>
				`).join('');
			}
			if (ticketsTable) {
				const tickets = await api('/api/tickets');
				ticketsTable.innerHTML = tickets.map(t => `
					<tr>
						<td>#${t.id}</td>
						<td>${t.subject}</td>
						<td>${t.status}</td>
						<td>${new Date(t.created_at).toLocaleString()}</td>
					</tr>
				`).join('');
			}
		} catch (err) {
			console.error(err);
		}
	})();

	// Init
	refreshNav();
})();

