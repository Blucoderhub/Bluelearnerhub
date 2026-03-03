import { db } from './index';
import { domains } from './schema';

const engineeringDomains = [
    'Computer Science',
    'Mechanical',
    'Electrical',
    'Civil',
    'Aerospace',
    'Robotics',
    'Automotive',
    'Chemical',
    'Biomedical',
    'Industrial',
];

const managementDomains = [
    'MBA',
    'Finance',
    'Marketing',
    'Operations',
    'HR',
    'Product Management',
    'Entrepreneurship',
    'Supply Chain',
    'Business Analytics',
];

async function seed() {
    console.log('🌱 Seeding domains...');

    try {
        // Insert Engineering Domains
        for (const name of engineeringDomains) {
            await db.insert(domains).values({
                name,
                type: 'ENGINEERING',
                description: `${name} Engineering specialization and courses.`,
            }).onConflictDoNothing();
        }

        // Insert Management Domains
        for (const name of managementDomains) {
            await db.insert(domains).values({
                name,
                type: 'MANAGEMENT',
                description: `${name} Management specialization and courses.`,
            }).onConflictDoNothing();
        }

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed();
