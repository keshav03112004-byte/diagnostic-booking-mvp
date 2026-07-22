require('dotenv').config();
const Disease = require('../models/Disease');
const Test = require('../models/Test');
const Package = require('../models/Package');
const { tests, packages, diseases } = require('../data/richContent');

const seedDatabase = async (force = false) => {
  const testCount = await Test.countDocuments();
  if (testCount > 0 && !force) {
    console.log(`Database already seeded (${testCount} tests, ${await Package.countDocuments()} packages)`);
    return;
  }

  console.log(`Seeding DiagBook catalog: ${tests.length} tests, ${packages.length} packages...`);

  await Promise.all([
    Disease.deleteMany({}),
    Test.deleteMany({}),
    Package.deleteMany({}),
  ]);

  await Disease.insertMany(diseases);
  const insertedTests = await Test.insertMany(tests);

  const bySlug = (slug) => insertedTests.find((t) => t.slug === slug)?._id;

  const packageDocs = packages.map((pkg) => {
    const { testSlugs, thyrocareId, ...rest } = pkg;
    const testIds = (testSlugs || []).map((slug) => bySlug(slug)).filter(Boolean);
    return {
      ...rest,
      totalTestsCount: rest.totalTestsCount || testSlugs?.length || testIds.length || 0,
      tests: testIds,
    };
  });

  await Package.insertMany(packageDocs);

  console.log(`Seeded ${tests.length} tests, ${packages.length} packages, ${diseases.length} disease categories`);
};

module.exports = seedDatabase;
