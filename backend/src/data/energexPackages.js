/**
 * EnergeX curated package catalog (8 packages).
 * Male / Female / Senior panels reuse Thyrocare Aarogyam parameter lists where linked.
 */
const thyrocarePackages = require('./thyrocarePackages');

const bySlug = (slug) => thyrocarePackages.find((p) => p.slug === slug);

const aarogyamMale = bySlug('aarogyam-male');
const aarogyamFemale = bySlug('aarogyam-female');
const seniorMale = bySlug('senior-citizen-profile-male');

const sharedFaqs = (name) => [
  {
    question: `What is included in ${name}?`,
    answer: `${name} is a preventive screening package. Full parameter lists are shown on this page. Book on WhatsApp for free home collection.`,
  },
  {
    question: 'How do I book this package?',
    answer:
      'Tap Book Now to chat on WhatsApp. Our team will confirm your slot and arrange free home sample collection.',
  },
  {
    question: 'When will I get my report?',
    answer:
      'Most reports are available within 24 hours after sample collection, depending on the tests included.',
  },
];

const packages = [
  {
    name: 'EnergeX Basic Health Checkup',
    slug: 'energex-basic-health-checkup',
    price: 799,
    originalPrice: 1999,
    description:
      'Essential preventive screening with CBC, sugar, HbA1c, liver, lipid, kidney, thyroid and iron profiles.',
    overview:
      'EnergeX Basic Health Checkup covers the core markers every adult should track — blood count, diabetes risk, heart lipids, liver, kidney, thyroid and iron. Ideal for annual screening with free home collection.',
    gender: 'Male & Female',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Adults for routine annual checkup',
    diseaseCategories: ['diabetes', 'heart', 'liver', 'kidney', 'thyroid', 'anaemia'],
    isPopular: true,
    totalTestsCount: 8,
    includedTestNames: [
      'CBC',
      'HbA1c',
      'Blood Sugar (Fasting)',
      'Liver Profile',
      'Lipid Profile',
      'Renal Profile',
      'Thyroid Profile',
      'Iron Profile',
    ],
    testSlugs: [],
    benefits: [
      '8 essential health profiles',
      'Free home sample collection',
      'NABL accredited partner labs',
      'WhatsApp booking & support',
    ],
    highlights: ['CBC & Iron', 'Diabetes markers', 'Liver, Lipid & Kidney', 'Thyroid profile'],
    preparation:
      'Fast for 8–10 hours before sample collection (water allowed). Avoid alcohol the night before.',
    testCategories: [
      { name: 'Blood Health', tests: ['CBC (Complete Blood Count)', 'Iron Profile'] },
      { name: 'Diabetes', tests: ['HbA1c', 'Blood Sugar (Fasting)'] },
      { name: 'Heart & Metabolism', tests: ['Lipid Profile', 'Thyroid Profile'] },
      { name: 'Organ Health', tests: ['Liver Profile', 'Renal Profile'] },
    ],
    faqs: sharedFaqs('EnergeX Basic Health Checkup'),
  },
  {
    name: 'EnergeX Advance Full Body Checkup',
    slug: 'energex-advance-full-body-checkup',
    price: 1199,
    originalPrice: 4200,
    description:
      'Comprehensive 90+ parameter full body checkup for you and your family — vitamins, diabetes, thyroid, organ profiles, CBC and urine.',
    overview:
      'EnergeX Advance Full Body Checkup (Advance Parameter 90+) delivers comprehensive care for you and your family. It covers vitamins, diabetic and thyroid profiles, liver, lipid, kidney, electrolytes, iron, complete blood count and complete urine analysis — with NABL-accredited labs and free home sample collection.',
    gender: 'Male & Female',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Individuals & families wanting a full preventive screen',
    diseaseCategories: ['diabetes', 'thyroid', 'heart', 'liver', 'kidney', 'vitamins', 'anaemia'],
    isPopular: true,
    totalTestsCount: 90,
    includedTestNames: [
      '25-OH Vitamin D (Total)',
      'Vitamin B12',
      'Vitamin B9 (Folic Acid)',
      'HbA1c',
      'Fasting Blood Sugar',
      'Total T3',
      'Total T4',
      'Ultrasensitive TSH (UTSH)',
      'Liver Function & Enzymes',
      'Lipid Profile',
      'Kidney Profile',
      'Electrolytes',
      'Iron Deficiency Profile',
      'Complete Blood Count',
      'Complete Urine Analysis',
    ],
    testSlugs: [],
    benefits: [
      '90+ parameters tested',
      'NABL accredited labs — Trusted. Certified. Reliable.',
      'Accurate & clinically verified reports',
      'Free home sample collection',
    ],
    highlights: ['70% OFF vs MRP', 'Vitamins D, B12 & B9', 'Full organ panels', 'CBC + Urine analysis'],
    preparation:
      'Fast for 8–10 hours before sample collection (water allowed). Ideal for family preventive checkups.',
    testCategories: [
      {
        name: 'Vitamins Profile (3)',
        tests: ['25-OH Vitamin D (Total)', 'Vitamin B12', 'Vitamin B9 (Folic Acid)'],
      },
      { name: 'Diabetic Profile (2)', tests: ['HbA1c', 'Fasting Blood Sugar'] },
      {
        name: 'Thyroid Profile (3)',
        tests: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Ultrasensitive TSH (UTSH)'],
      },
      {
        name: 'Liver Profile (12)',
        tests: ['Liver function & enzymes', 'Bilirubin, Proteins', 'SGOT (AST)', 'SGPT (ALT)'],
      },
      {
        name: 'Lipid Profile (10)',
        tests: ['Cholesterol, HDL, LDL', 'Triglycerides', 'VLDL, Ratios'],
      },
      {
        name: 'Kidney Profile (6)',
        tests: ['Blood Urea, Creatinine', 'Calcium, Uric Acid', 'eGFR & more'],
      },
      { name: 'Electrolytes (3)', tests: ['Potassium', 'Chloride', 'Sodium'] },
      {
        name: 'Iron Deficiency Profile (4)',
        tests: ['Iron, TIBC', '% Transferrin Saturation', 'Unsat. Iron Binding Capacity'],
      },
      {
        name: 'Complete Blood Count (30)',
        tests: ['RBC, WBC, Platelets & other key indicators'],
      },
      {
        name: 'Complete Urine Analysis (20)',
        tests: ['Physical, Chemical & Microscopic Examination'],
      },
    ],
    faqs: sharedFaqs('EnergeX Advance Full Body Checkup'),
  },
  {
    name: 'EnergeX Heart Care Plan',
    slug: 'energex-heart-care-plan',
    price: 1999,
    originalPrice: 4999,
    description:
      'Advanced heart health package with 45–55 parameters — cardiac risk markers, diabetes, lipids, thyroid, kidney, liver, electrolytes and vitamins.',
    overview:
      'EnergeX Heart Care Plan is an advanced heart health package for comprehensive screening to assess your heart health and prevent future risks. It includes cardiac risk markers (hs-CRP, Apo A1/B, Lp(a), Homocysteine), diabetes and lipid profiles, thyroid, kidney, liver, electrolytes and vitamins D & B12 — with free home sample collection.',
    gender: 'Male & Female',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Adults concerned about heart health & lifestyle risk',
    diseaseCategories: ['heart', 'diabetes', 'thyroid', 'kidney', 'liver', 'vitamins'],
    isPopular: true,
    totalTestsCount: 50,
    includedTestNames: [
      'hs-CRP',
      'Apo A1',
      'Apo B',
      'Apo B/A1 Ratio',
      'Lipoprotein (a)',
      'Homocysteine',
      'Fasting Blood Sugar',
      'HbA1c',
      'Lipid Profile',
      'Thyroid Profile',
      'Kidney Health Panel',
      'Liver Function Panel',
      'Electrolytes',
      'Vitamin D (25-OH)',
      'Vitamin B12',
    ],
    testSlugs: [],
    benefits: [
      '45–55 parameters tested',
      'NABL accredited labs',
      'Accurate & reliable reports',
      'Free home sample collection — Safe | Convenient | Hygienic',
      'Fast turnaround & expert health insights',
    ],
    highlights: ['60% OFF', 'Cardiac risk markers', 'Early detection', 'Stronger heart focus'],
    preparation:
      'Fast for 8–10 hours before sample collection (water allowed). Share any cardiac history with our WhatsApp team when booking.',
    testCategories: [
      {
        name: 'Cardiac Risk Markers',
        tests: [
          'hs-CRP (High Sensitivity C-Reactive Protein)',
          'Apo A1',
          'Apo B',
          'Apo B/A1 Ratio',
          'Lipoprotein (a)',
          'Homocysteine',
        ],
      },
      { name: 'Diabetes Risk', tests: ['Fasting Blood Sugar', 'HbA1c'] },
      {
        name: 'Lipid Profile',
        tests: [
          'Total Cholesterol',
          'HDL Cholesterol',
          'LDL Cholesterol',
          'Triglycerides',
          'VLDL Cholesterol',
          'TC/HDL Ratio',
          'LDL/HDL Ratio',
        ],
      },
      { name: 'Thyroid Profile', tests: ['Total T3', 'Total T4', 'TSH'] },
      {
        name: 'Kidney Health',
        tests: ['Serum Creatinine', 'Blood Urea', 'Uric Acid', 'Microalbumin', 'eGFR'],
      },
      {
        name: 'Liver Function',
        tests: [
          'SGOT (AST)',
          'SGPT (ALT)',
          'Alkaline Phosphatase',
          'Bilirubin (Total & Direct)',
          'GGT',
          'Total Protein',
          'Albumin',
        ],
      },
      { name: 'Electrolytes', tests: ['Sodium', 'Potassium', 'Chloride'] },
      { name: 'Vitamin Profile', tests: ['Vitamin D (25-OH)', 'Vitamin B12'] },
    ],
    faqs: sharedFaqs('EnergeX Heart Care Plan'),
  },
  {
    name: 'EnergeX Senior Citizen Plan',
    slug: 'energex-senior-citizen-plan',
    price: 2399,
    originalPrice: seniorMale?.originalPrice || 3239,
    description:
      'Comprehensive preventive checkup designed for seniors — organ health, diabetes, heart markers, vitamins and more.',
    overview:
      'EnergeX Senior Citizen Plan is tailored for older adults who need thorough preventive screening. Based on advanced senior panels covering hemogram, diabetes, cardiac risk, thyroid, vitamins, organ function and more — with free home collection for comfortable testing.',
    gender: 'Male & Female',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Seniors aged 60+',
    diseaseCategories: ['diabetes', 'heart', 'thyroid', 'kidney', 'vitamins'],
    isPopular: true,
    totalTestsCount: seniorMale?.totalTestsCount || 127,
    includedTestNames: seniorMale?.includedTestNames || [],
    testSlugs: [],
    benefits: [
      'Senior-focused comprehensive panel',
      'Free home sample collection',
      'NABL-aligned partner labs',
      'WhatsApp booking & counselling support',
    ],
    highlights: seniorMale?.highlights || ['Full senior panel', 'Home collection', '24-hour reports'],
    preparation:
      'Fast for 8–10 hours (water allowed). Take regular medicines after the blood draw unless your doctor advises otherwise.',
    testCategories: seniorMale?.testCategories || [],
    faqs: sharedFaqs('EnergeX Senior Citizen Plan'),
  },
  {
    name: 'EnergeX Female Care Plan',
    slug: 'energex-female-care-plan',
    price: aarogyamFemale?.price || 2755,
    originalPrice: aarogyamFemale?.originalPrice || 3857,
    description:
      'Women-focused comprehensive health panel covering hormones, vitamins, iron, organ profiles and more.',
    overview:
      'EnergeX Female Care Plan is built around women’s preventive needs — based on the Aarogyam Female panel covering hemogram, thyroid, hormones, infertility markers, iron, vitamins, cardiac risk, liver, kidney and more.',
    gender: 'Female',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Women for comprehensive wellness screening',
    diseaseCategories: ['thyroid', 'vitamins', 'anaemia', 'heart'],
    isPopular: true,
    totalTestsCount: aarogyamFemale?.totalTestsCount || 105,
    includedTestNames: aarogyamFemale?.includedTestNames || [],
    testSlugs: [],
    benefits: [
      'Female-focused comprehensive panel',
      'Hormone, iron & vitamin screening',
      'Free home sample collection',
      'WhatsApp booking & support',
    ],
    highlights: aarogyamFemale?.highlights || ['Women’s wellness', 'Full parameter panel'],
    preparation:
      'Fast for 8–10 hours before sample collection (water allowed). Share cycle-related concerns with our team if relevant.',
    testCategories: aarogyamFemale?.testCategories || [],
    faqs: sharedFaqs('EnergeX Female Care Plan'),
  },
  {
    name: 'EnergeX Male Care Plan',
    slug: 'energex-male-care-plan',
    price: aarogyamMale?.price || 2545,
    originalPrice: aarogyamMale?.originalPrice || 3563,
    description:
      'Men-focused comprehensive health panel covering hormones, cancer markers, heart risk, vitamins and organ profiles.',
    overview:
      'EnergeX Male Care Plan is built for men’s preventive screening — based on the Aarogyam Male package covering hemogram, hormones, cancer markers, cardiac risk, diabetes, vitamins, liver, kidney and more.',
    gender: 'Male',
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor: 'Men for comprehensive wellness screening',
    diseaseCategories: ['heart', 'diabetes', 'thyroid', 'vitamins'],
    isPopular: true,
    totalTestsCount: aarogyamMale?.totalTestsCount || 103,
    includedTestNames: aarogyamMale?.includedTestNames || [],
    testSlugs: [],
    benefits: [
      'Male-focused comprehensive panel',
      'Hormone & cancer marker screening',
      'Free home sample collection',
      'WhatsApp booking & support',
    ],
    highlights: aarogyamMale?.highlights || ['Men’s wellness', 'Full parameter panel'],
    preparation: 'Fast for 8–10 hours before sample collection (water allowed).',
    testCategories: aarogyamMale?.testCategories || [],
    faqs: sharedFaqs('EnergeX Male Care Plan'),
  },
  {
    name: 'EnergeX Cancer Screening Male',
    slug: 'energex-cancer-screening-male',
    price: 699,
    originalPrice: 2330,
    description:
      'Male cancer screening with PSA, CEA and CA-19.9 markers for early risk assessment.',
    overview:
      'EnergeX Cancer Screening Male helps with early detection using key cancer markers — PSA (prostate), CEA (colorectal/GI) and CA-19.9 (pancreatic). Fasting not required. Free home sample collection via WhatsApp booking.',
    gender: 'Male',
    fastingRequired: false,
    fastingHours: 0,
    reportTatHours: 24,
    recommendedFor: 'Men aged 20+ for proactive cancer screening',
    diseaseCategories: [],
    isPopular: false,
    totalTestsCount: 3,
    includedTestNames: [
      'CA-19.9 (Pancreatic Cancer Marker)',
      'CEA (Colorectal Cancer Marker)',
      'PSA Total (Prostate Cancer Marker)',
    ],
    testSlugs: [],
    benefits: [
      '3 essential male cancer markers',
      'No fasting required',
      'Free home sample collection',
      'Early detection focused',
    ],
    highlights: ['PSA', 'CEA', 'CA-19.9', '70% OFF vs MRP'],
    preparation: 'No fasting required. Share family history of cancer when booking on WhatsApp if relevant.',
    testCategories: [
      {
        name: 'Cancer Markers',
        tests: [
          'CA-19.9 (Pancreatic Cancer Marker Test)',
          'CEA — Carcino Embryonic Antigen (Colorectal Cancer Marker Test)',
          'PSA Total — Prostate Specific Antigen (Prostate Cancer Marker Test)',
        ],
      },
    ],
    faqs: sharedFaqs('EnergeX Cancer Screening Male'),
  },
  {
    name: 'EnergeX Cancer Screening Female',
    slug: 'energex-cancer-screening-female',
    price: 699,
    originalPrice: 2330,
    description:
      'Female cancer screening with CA-125, CA-15.3 and CEA markers for early risk assessment.',
    overview:
      'EnergeX Cancer Screening Female supports early detection with CA-125 (ovarian), CA-15.3 (breast) and CEA (colorectal) markers. Fasting not required. Free home sample collection via WhatsApp booking.',
    gender: 'Female',
    fastingRequired: false,
    fastingHours: 0,
    reportTatHours: 24,
    recommendedFor: 'Women aged 20+ for proactive cancer screening',
    diseaseCategories: [],
    isPopular: false,
    totalTestsCount: 3,
    includedTestNames: [
      'CA-125 (Ovarian Cancer Marker)',
      'CA-15.3 (Breast Cancer Marker)',
      'CEA (Colorectal Cancer Marker)',
    ],
    testSlugs: [],
    benefits: [
      '3 essential female cancer markers',
      'No fasting required',
      'Free home sample collection',
      'Early detection focused',
    ],
    highlights: ['CA-125', 'CA-15.3', 'CEA', '70% OFF vs MRP'],
    preparation: 'No fasting required. Share family history of cancer when booking on WhatsApp if relevant.',
    testCategories: [
      {
        name: 'Cancer Markers',
        tests: [
          'CA-125 (Ovarian Cancer Marker Test)',
          'CA-15.3 (Breast Cancer Marker Test)',
          'CEA — Carcino Embryonic Antigen (Colorectal Cancer Marker Test)',
        ],
      },
    ],
    faqs: sharedFaqs('EnergeX Cancer Screening Female'),
  },
];

module.exports = packages;
