import axios from 'axios';
import { env } from './env.js';

const baseUrl = env.cashfree.sandbox
	? 'https://sandbox.cashfree.com/pg'
	: 'https://api.cashfree.com/pg';

export const cashfreeClient = axios.create({
	baseURL: baseUrl,
	headers: {
		'Content-Type': 'application/json',
		'x-client-id': env.cashfree.appId,
		'x-client-secret': env.cashfree.secretKey,
		'x-api-version': '2022-09-01'
	}
});

export default cashfreeClient;

