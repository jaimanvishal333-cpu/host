import axios, { type AxiosInstance } from 'axios'

export type WhmcsAuth =
	| { type: 'api'; identifier: string; secret: string }
	| { type: 'session'; username: string; password: string }

export interface WhmcsClientOptions {
	baseUrl: string
	auth?: WhmcsAuth
	accessKey?: string
}

export class WhmcsClient {
	private options: WhmcsClientOptions
	private http: AxiosInstance

	constructor(options: WhmcsClientOptions) {
		this.options = options
		this.http = axios.create({
			baseURL: options.baseUrl.replace(/\/$/, '') + '/includes/api.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			withCredentials: true,
		})
	}

	private buildParams(params: Record<string, any>) {
		const base: Record<string, any> = {
			responsetype: 'json',
			...params,
		}
		if (this.options.accessKey) base['accesskey'] = this.options.accessKey
		if (this.options.auth?.type === 'api') {
			base['identifier'] = this.options.auth.identifier
			base['secret'] = this.options.auth.secret
		}
		if (this.options.auth?.type === 'session') {
			base['username'] = this.options.auth.username
			base['password'] = this.options.auth.password
		}
		const body = new URLSearchParams()
		Object.entries(base).forEach(([k, v]) => {
			if (v !== undefined && v !== null) body.append(k, String(v))
		})
		return body
	}

	async request<T = any>(action: string, params: Record<string, any> = {}): Promise<T> {
		const body = this.buildParams({ action, ...params })
		const { data } = await this.http.post('', body)
		if (data?.result && data.result !== 'success') {
			throw new Error(data.message || 'WHMCS API error')
		}
		return data as T
	}
}

export const createWhmcsFromEnv = () => {
	const baseUrl = import.meta.env.VITE_WHMCS_BASE_URL as string
	const identifier = import.meta.env.VITE_WHMCS_API_IDENTIFIER as string | undefined
	const secret = import.meta.env.VITE_WHMCS_API_SECRET as string | undefined
	const accessKey = import.meta.env.VITE_WHMCS_ACCESS_KEY as string | undefined
	if (!baseUrl) throw new Error('Missing VITE_WHMCS_BASE_URL')
	return new WhmcsClient({
		baseUrl,
		auth: identifier && secret ? { type: 'api', identifier, secret } : undefined,
		accessKey,
	})
}