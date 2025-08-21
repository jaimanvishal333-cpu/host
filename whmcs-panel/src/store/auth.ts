import { create } from 'zustand'
import Cookies from 'js-cookie'
import { createWhmcsFromEnv } from '../lib/whmcs'

interface AuthState {
	isAuthenticated: boolean
	sessionUsername?: string
	clientId?: number
	loading: boolean
	error?: string
	login: (email: string, password: string) => Promise<boolean>
	logout: () => void
	initFromCookies: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	loading: false,
	async initFromCookies() {
		const email = Cookies.get('whmcs_email')
		const clientIdCookie = Cookies.get('whmcs_clientid')
		if (email) {
			set({ isAuthenticated: true, sessionUsername: email })
			if (clientIdCookie) {
				set({ clientId: Number(clientIdCookie) })
			} else {
				try {
					const api = createWhmcsFromEnv()
					const res = await api.request<any>('GetClientsDetails', { email })
					if (res?.client?.id) {
						Cookies.set('whmcs_clientid', String(res.client.id), { expires: 7 })
						set({ clientId: Number(res.client.id) })
					}
				} catch {}
			}
		}
	},
	async login(email, password) {
		set({ loading: true, error: undefined })
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('ValidateLogin', { email, password })
			if (res.result === 'success') {
				Cookies.set('whmcs_email', email, { expires: 7 })
				set({ isAuthenticated: true, sessionUsername: email, loading: false })
				try {
					const details = await api.request<any>('GetClientsDetails', { email })
					if (details?.client?.id) {
						Cookies.set('whmcs_clientid', String(details.client.id), { expires: 7 })
						set({ clientId: Number(details.client.id) })
					}
				} catch {}
				return true
			} else {
				set({ error: res.message || 'Login failed', loading: false })
				return false
			}
		} catch (e: any) {
			set({ error: e.message || 'Login error', loading: false })
			return false
		}
	},
	logout() {
		Cookies.remove('whmcs_email')
		Cookies.remove('whmcs_clientid')
		set({ isAuthenticated: false, sessionUsername: undefined, clientId: undefined })
	},
}))