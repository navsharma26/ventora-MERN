const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const Guide = require('./models/Guide');
const Review = require('./models/Review');

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventora.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventora.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventora.com', password: 'password123', role: 'user' },
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Silicon Valley Innovation Center, San Francisco, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        coordinates: { lat: 37.7749, lng: -122.4194 },
        averageRating: 4.9,
        totalReviews: 12,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Grand Arena, New York, NY',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        coordinates: { lat: 40.7128, lng: -74.0060 },
        averageRating: 4.8,
        totalReviews: 24,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'The Ritz-Carlton, London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        coordinates: { lat: 51.5074, lng: -0.1278 },
        averageRating: 4.7,
        totalReviews: 8,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Modern Art Expo 2024',
        description: 'Discover breathtaking contemporary and modern arts from underground and trending artists this season.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'Downtown Art Museum, Chicago, IL',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        coordinates: { lat: 41.8781, lng: -87.6298 },
        averageRating: 4.6,
        totalReviews: 15,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch Competition',
        description: 'Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Convention Center, Miami, FL',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        coordinates: { lat: 25.7617, lng: -80.1918 },
        averageRating: 4.9,
        totalReviews: 19,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing Architecture Seminar',
        description: 'A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Tech Hub, Seattle, WA',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        coordinates: { lat: 47.6062, lng: -122.3321 },
        averageRating: 4.8,
        totalReviews: 10,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    }
];

const dummyGuides = [
    {
        name: 'Elena Rostova',
        title: 'Licensed City & Culture Concierge',
        bio: 'Over 8 years guiding travelers through historical downtowns, VIP event passes, and secret culinary spots.',
        city: 'San Francisco',
        languages: ['English', 'Spanish', 'French'],
        rating: 4.9,
        hourlyRate: 80,
        contactEmail: 'elena.guide@eventora.com',
        phone: '+1 (555) 234-5678',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        specialties: ['Tech Hubs', 'Nightlife', 'Museums'],
        experienceYears: 8
    },
    {
        name: 'Marcus Vance',
        title: 'VIP Event & Music Festival Specialist',
        bio: 'Professional concert escort and backstage coordinator with insider access to top music venues and festivals.',
        city: 'New York',
        languages: ['English', 'German'],
        rating: 5.0,
        hourlyRate: 120,
        contactEmail: 'marcus.vance@eventora.com',
        phone: '+1 (555) 876-5432',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        specialties: ['EDM Festivals', 'VIP Transport', 'Clubs'],
        experienceYears: 10
    },
    {
        name: 'Aisha Patel',
        title: 'Executive Summit & Tech Tour Guide',
        bio: 'Specializing in corporate delegations, business summits, and local tech ecosystem introductions.',
        city: 'London',
        languages: ['English', 'Hindi', 'Mandarin'],
        rating: 4.8,
        hourlyRate: 95,
        contactEmail: 'aisha.patel@eventora.com',
        phone: '+44 20 7946 0912',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        specialties: ['Business Delegations', 'Fine Dining', 'City Landmark Tours'],
        experienceYears: 6
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventora');
        console.log('\n✅ MongoDB connection open for seeding...');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        await Guide.deleteMany();
        await Review.deleteMany();
        console.log('🗑️  Cleared existing database collections.');

        // Hash user passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');

        // Insert Events
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} events with coordinates & rating metadata.`);

        // Insert Guides
        await Guide.insertMany(dummyGuides);
        console.log(`🧭 Created ${dummyGuides.length} verified local tourist guides.`);

        // Insert Sample Reviews
        const reviewsData = [
            {
                userId: normalUsers[0]._id,
                eventId: createdEvents[0]._id,
                rating: 5,
                comment: 'Incredible developer retreat! Learned so much about full-stack scaling and met great mentors.'
            },
            {
                userId: normalUsers[1]._id,
                eventId: createdEvents[0]._id,
                rating: 5,
                comment: 'Seamless organization and top tier speakers. 10/10 recommendation!'
            },
            {
                userId: normalUsers[2]._id,
                eventId: createdEvents[1]._id,
                rating: 5,
                comment: 'The lighting and acoustics at Neon Nights were out of this world!'
            }
        ];

        await Review.insertMany(reviewsData);
        console.log(`⭐ Created ${reviewsData.length} sample event reviews.`);

        console.log('\n🚀 Database populated successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();
