import { randomInt } from 'crypto';

export function generateOtp() {
	const otp = randomInt(100000, 999999).toString();
	const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
	return { otp, expiresAt };
}

export default { generateOtp };

