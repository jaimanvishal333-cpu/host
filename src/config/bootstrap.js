import User from '../models/User.js';
import Plan from '../models/Plan.js';

export async function bootstrap({ adminEmail, adminPassword, adminName }) {
	if (adminEmail && adminPassword) {
		const existingAdmin = await User.findOne({ email: adminEmail });
		if (!existingAdmin) {
			const passwordHash = await User.hashPassword(adminPassword);
			await User.create({ name: adminName || 'Admin', email: adminEmail, passwordHash, role: 'admin', isEmailVerified: true });
		}
	}

	const planCount = await Plan.countDocuments();
	if (planCount === 0) {
		await Plan.insertMany([
			{ title: 'VPS Starter', category: 'vps', description: '1 vCPU, 1GB RAM, 25GB SSD', priceMonthly: 299, priceYearly: 2999, features: ['1 vCPU', '1GB RAM', '25GB SSD', '1TB Bandwidth'] },
			{ title: 'Dedicated Pro', category: 'dedicated', description: '8 cores, 32GB RAM, 2x1TB SSD RAID1', priceMonthly: 8999, priceYearly: 95999, features: ['Intel Xeon', '32GB RAM', '2x1TB SSD', '10TB Bandwidth'] },
			{ title: 'Cloud Scale', category: 'cloud', description: 'Auto-scale with load balancer', priceMonthly: 1999, priceYearly: 21999, features: ['Autoscaling', 'LB included', 'Managed backups'] }
		]);
	}
}

export default bootstrap;

