// ============================================================
// Database Seed Script
// ============================================================
// Run with: pnpm --filter @eastern/api run db:seed
// Generates realistic demo data for development.
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // Clean existing data
  console.log('[Seed] Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.xpTransaction.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.webPushSubscription.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.competitionEntry.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatParticipant.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.match.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.mention.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.story.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.event.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.course.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.university.deleteMany();

  // ============================================================
  // Universities
  // ============================================================
  console.log('[Seed] Creating universities...');

  const uniben = await prisma.university.create({
    data: {
      name: 'University of Benin',
      shortName: 'UNIBEN',
      domain: 'uniben.edu',
      city: 'Benin City',
      state: 'Edo',
    },
  });

  const unilag = await prisma.university.create({
    data: {
      name: 'University of Lagos',
      shortName: 'UNILAG',
      domain: 'unilag.edu.ng',
      city: 'Lagos',
      state: 'Lagos',
    },
  });

  const unn = await prisma.university.create({
    data: {
      name: 'University of Nigeria, Nsukka',
      shortName: 'UNN',
      domain: 'unn.edu.ng',
      city: 'Nsukka',
      state: 'Enugu',
    },
  });

  // ============================================================
  // Faculties & Departments
  // ============================================================
  console.log('[Seed] Creating faculties and departments...');

  const faculties = [
    {
      name: 'Faculty of Engineering',
      universityId: uniben.id,
      departments: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Computer Engineering'],
    },
    {
      name: 'Faculty of Science',
      universityId: uniben.id,
      departments: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biochemistry'],
    },
    {
      name: 'Faculty of Arts',
      universityId: uniben.id,
      departments: ['English', 'Mass Communication', 'Philosophy', 'History'],
    },
    {
      name: 'Faculty of Social Sciences',
      universityId: uniben.id,
      departments: ['Economics', 'Political Science', 'Psychology', 'Sociology'],
    },
  ];

  for (const facultyData of faculties) {
    const faculty = await prisma.faculty.create({
      data: {
        name: facultyData.name,
        universityId: facultyData.universityId,
      },
    });

    for (const deptName of facultyData.departments) {
      await prisma.department.create({
        data: {
          name: deptName,
          facultyId: faculty.id,
          universityId: facultyData.universityId,
        },
      });
    }
  }

  // ============================================================
  // Courses
  // ============================================================
  console.log('[Seed] Creating sample courses...');

  const csDept = await prisma.department.findFirst({
    where: { name: 'Computer Science', universityId: uniben.id },
  });

  if (csDept) {
    const courses = [
      { code: 'CSC101', name: 'Introduction to Programming' },
      { code: 'CSC201', name: 'Data Structures' },
      { code: 'CSC202', name: 'Object-Oriented Programming' },
      { code: 'CSC301', name: 'Database Systems' },
      { code: 'CSC302', name: 'Operating Systems' },
      { code: 'CSC401', name: 'Software Engineering' },
      { code: 'CSC402', name: 'Artificial Intelligence' },
      { code: 'MTH101', name: 'General Mathematics I' },
      { code: 'MTH201', name: 'Linear Algebra' },
      { code: 'PHY101', name: 'General Physics I' },
    ];

    for (const course of courses) {
      await prisma.course.upsert({
        where: { code_departmentId: { code: course.code, departmentId: csDept.id } },
        update: {},
        create: { ...course, departmentId: csDept.id },
      });
    }
  }

  // ============================================================
  // Hostels
  // ============================================================
  console.log('[Seed] Creating hostels...');

  const hostels = [
    { name: 'Hall 1 (Ekiosa)', universityId: uniben.id },
    { name: 'Hall 2 (Ugbowo)', universityId: uniben.id },
    { name: 'Hall 3 (Oba Erediauwa)', universityId: uniben.id },
    { name: 'Hall 4 (Queen Idia)', universityId: uniben.id },
    { name: 'Off-Campus (Ugbowo)', universityId: uniben.id },
    { name: 'Off-Campus (Ekiosa)', universityId: uniben.id },
  ];

  for (const hostel of hostels) {
    await prisma.hostel.upsert({
      where: { name_universityId: { name: hostel.name, universityId: hostel.universityId } },
      update: {},
      create: hostel,
    });
  }

  // ============================================================
  // Demo Users
  // ============================================================
  console.log('[Seed] Creating demo users...');

  const passwordHash = await bcrypt.hash('Password123', 12);
  const demoUsers = [
    { email: 'admin@easterngist.com', displayName: 'Admin User', username: 'admin', role: 'SUPER_ADMIN' as const },
    { email: 'chioma@easterngist.com', displayName: 'Chioma Okafor', username: 'chioma', role: 'STUDENT' as const },
    { email: 'emeka@easterngist.com', displayName: 'Emeka Nwosu', username: 'emeka', role: 'STUDENT' as const },
    { email: 'amina@easterngist.com', displayName: 'Amina Bello', username: 'amina', role: 'STUDENT' as const },
    { email: 'tunde@easterngist.com', displayName: 'Tunde Balogun', username: 'tunde', role: 'STUDENT' as const },
    { email: 'ngozi@easterngist.com', displayName: 'Ngozi Eze', username: 'ngozi', role: 'STUDENT' as const },
    { email: 'kola@easterngist.com', displayName: 'Kola Adeyemi', username: 'kola', role: 'STUDENT' as const },
    { email: 'zainab@easterngist.com', displayName: 'Zainab Mohammed', username: 'zainab', role: 'STUDENT' as const },
    { email: 'ifeanyi@easterngist.com', displayName: 'Ifeanyi Okonkwo', username: 'ifeanyi', role: 'STUDENT' as const },
    { email: 'temitope@easterngist.com', displayName: 'Temitope Adebayo', username: 'temitope', role: 'STUDENT' as const },
    { email: 'fatima@easterngist.com', displayName: 'Fatima Usman', username: 'fatima', role: 'STUDENT' as const },
    { email: 'david@easterngist.com', displayName: 'David Ogunlade', username: 'david', role: 'STUDENT' as const },
    { email: 'mercy@easterngist.com', displayName: 'Mercy Johnson', username: 'mercy', role: 'STUDENT' as const },
    { email: 'seguna@easterngist.com', displayName: 'Segun Adeleke', username: 'segun', role: 'STUDENT' as const },
    { email: 'adaeze@easterngist.com', displayName: 'Adaeze Obi', username: 'adaeze', role: 'STUDENT' as const },
    { email: 'chidi@easterngist.com', displayName: 'Chidi Okafor', username: 'chidi', role: 'STUDENT' as const },
    { email: 'blessing@easterngist.com', displayName: 'Blessing Akpan', username: 'blessing', role: 'STUDENT' as const },
    { email: 'daniel@easterngist.com', displayName: 'Daniel Ibrahim', username: 'daniel_ib', role: 'STUDENT' as const },
    { email: 'sarah@easterngist.com', displayName: 'Sarah Okeke', username: 'sarah_ok', role: 'STUDENT' as const },
    { email: 'micheal@easterngist.com', displayName: 'Micheal Okafor', username: 'micheals', role: 'STUDENT' as const },
  ];

  const hostelsList = await prisma.hostel.findMany({ where: { universityId: uniben.id } });
  const depts = await prisma.department.findMany({ where: { universityId: uniben.id } });
  const academics = [100, 200, 300, 400, 500];
  const genders = ['MALE', 'FEMALE', 'NON_BINARY'] as const;
  const loveLanguages = ['WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH'] as const;
  const interests = [
    'Music', 'Sports', 'Tech', 'Fashion', 'Reading', 'Gaming',
    'Photography', 'Cooking', 'Travel', 'Movies', 'Dancing', 'Art',
    'Fitness', 'Poetry', 'Volunteering', 'Entrepreneurship',
  ];

  for (const userData of demoUsers) {
    const dept = depts[Math.floor(Math.random() * depts.length)];
    const hostel = hostelsList[Math.floor(Math.random() * hostelsList.length)];
    const gender = genders[Math.floor(Math.random() * 2)]; // Only M/F for demo
    const userInterests = interests.sort(() => 0.5 - Math.random()).slice(0, 5);

    await prisma.user.create({
      data: {
        email: userData.email,
        emailVerified: true,
        passwordHash,
        role: userData.role,
        isStudentVerified: userData.role !== 'SUPER_ADMIN',
        profile: {
          create: {
            displayName: userData.displayName,
            username: userData.username,
            universityId: uniben.id,
            departmentId: dept.id,
            hostelId: hostel.id,
            academicLevel: academics[Math.floor(Math.random() * academics.length)],
            gender,
            loveLanguage: loveLanguages[Math.floor(Math.random() * loveLanguages.length)],
            interests: userInterests,
            bio: `${userData.displayName.split(' ')[0]} here! Studying at UNIBEN.`,
            xp: Math.floor(Math.random() * 5000),
            level: Math.floor(Math.random() * 10) + 1,
            streak: Math.floor(Math.random() * 30),
          },
        },
      },
    });
  }

  console.log('[Seed] Created', demoUsers.length, 'demo users');
  console.log('[Seed] Database seeded successfully!');
  console.log('[Seed] Login credentials: any email above with password "Password123"');
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });