require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { User, Campus, Course, Application } = require('./models/Schemas');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  seedDatabase();
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/api', apiRoutes);

// General health check
app.get('/', (req, res) => {
  res.send('Apex Multi-Campus Admission API Server is running...');
});

// Automatic Database Seeder Helper
async function seedDatabase() {
  try {
    // 1. Seed Campuses
    const campusCount = await Campus.countDocuments({});
    if (campusCount === 0) {
      console.log('Seeding initial campus data...');
      const createdCampuses = await Campus.insertMany([
        { name: 'Apex High School', type: 'School', location: 'North Wing Campus', capacity: 200, status: 'Active', description: 'K-10 primary and secondary educational excellence.' },
        { name: 'Royal Junior College', type: 'Junior College', location: 'East Wing Campus', capacity: 300, status: 'Active', description: 'Higher Secondary education specializing in Science, Commerce, and Arts.' },
        { name: 'Pioneer Degree College', type: 'Degree College', location: 'Central Campus', capacity: 500, status: 'Active', description: 'Undergraduate degrees in Computer Science, Humanities, and Commerce.' },
        { name: 'National ITI Academy', type: 'ITI', location: 'Industrial Sector Campus', capacity: 150, status: 'Active', description: 'Vocational training in Fitter, Welder, and Electrician trades.' },
        { name: 'Metro Polytechnic', type: 'Polytechnic', location: 'West Wing Campus', capacity: 250, status: 'Active', description: 'Professional Engineering diploma courses across core branches.' },
        { name: 'Advanced Training Camp', type: 'Training Camp', location: 'Mountain Base Site', capacity: 100, status: 'Active', description: 'Specialized programs in leadership, cyber security, and survival training.' },
      ]);

      // Map created IDs to seed courses
      const camSchool = createdCampuses[0]._id;
      const camJC = createdCampuses[1]._id;
      const camDegree = createdCampuses[2]._id;
      const camITI = createdCampuses[3]._id;
      const camPoly = createdCampuses[4]._id;
      const camTraining = createdCampuses[5]._id;

      console.log('Seeding initial course catalogs...');
      await Course.insertMany([
        // School
        { campusId: camSchool, name: 'High School (Grade 8-10)', fees: 12000, duration: '3 Years', availableSeats: 45, totalSeats: 50, eligibility: 'Completion of Class 7' },
        { campusId: camSchool, name: 'Primary School (Grade 1-5)', fees: 8000, duration: '5 Years', availableSeats: 38, totalSeats: 60, eligibility: 'Minimum 5 Years of age' },
        // JC
        { campusId: camJC, name: 'Science Stream (PCMB)', fees: 22000, duration: '2 Years', availableSeats: 85, totalSeats: 120, eligibility: 'Class 10 Pass (Min 60%)' },
        { campusId: camJC, name: 'Commerce Stream (MEC)', fees: 18000, duration: '2 Years', availableSeats: 98, totalSeats: 100, eligibility: 'Class 10 Pass' },
        // Degree
        { campusId: camDegree, name: 'B.Sc Computer Science', fees: 45000, duration: '3 Years', availableSeats: 12, totalSeats: 60, eligibility: 'Class 12 Science Pass (Min 55%)' },
        { campusId: camDegree, name: 'B.Com Honors', fees: 38000, duration: '3 Years', availableSeats: 28, totalSeats: 80, eligibility: 'Class 12 Pass (Min 50%)' },
        // ITI
        { campusId: camITI, name: 'Electrician Trade', fees: 15000, duration: '2 Years', availableSeats: 15, totalSeats: 30, eligibility: 'Class 10 Pass' },
        { campusId: camITI, name: 'Fitter Trade', fees: 14000, duration: '2 Years', availableSeats: 8, totalSeats: 30, eligibility: 'Class 10 Pass' },
        // Poly
        { campusId: camPoly, name: 'Diploma in Computer Engineering', fees: 28000, duration: '3 Years', availableSeats: 4, totalSeats: 40, eligibility: 'Class 10 Pass (Min 50% Math/Sci)' },
        { campusId: camPoly, name: 'Diploma in Mechanical Engineering', fees: 26000, duration: '3 Years', availableSeats: 18, totalSeats: 40, eligibility: 'Class 10 Pass (Min 50%)' },
        // Training Camp
        { campusId: camTraining, name: 'Cyber Security Operations', fees: 35000, duration: '6 Months', availableSeats: 15, totalSeats: 25, eligibility: 'Basic Computer Networking Knowledge' },
        { campusId: camTraining, name: 'Leadership & Tactical Training', fees: 15000, duration: '3 Months', availableSeats: 20, totalSeats: 40, eligibility: 'Physical Fitness Certificate' },
      ]);

      // Seed core users
      console.log('Seeding initial operational roles credentials...');
      // 1. Super Admin
      await User.create({
        name: 'Super Admin',
        email: 'admin@campus.edu',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890'
      });
      // 2. Admission Officer (assigned to Pioneer Degree College)
      await User.create({
        name: 'Officer Sarah Jones',
        email: 'officer@campus.edu',
        password: 'officer123',
        role: 'officer',
        campusId: camDegree,
        phone: '+1987654321'
      });
      // 3. Demo Student
      const student = await User.create({
        name: 'Alex Rivera',
        email: 'student@gmail.com',
        password: 'student123',
        role: 'student',
        phone: '+1445566778',
        dob: '2005-08-12',
        address: '123 University Ave',
        qualifications: 'Class 12 GPA 3.8/4.0',
        documentUrl: 'diploma_cert.pdf'
      });

      // Seed initial dummy application for student to show on dashboard immediately
      const degreeCSCourse = await Course.findOne({ name: 'B.Sc Computer Science' });
      if (degreeCSCourse) {
        await Application.create({
          studentId: student._id,
          studentName: student.name,
          studentEmail: student.email,
          campusId: camDegree,
          campusName: 'Pioneer Degree College',
          courseId: degreeCSCourse._id,
          courseName: degreeCSCourse.name,
          status: 'Pending',
          remarks: 'Awaiting high school transcript verification.',
          documentUrl: 'diploma_cert.pdf',
          feesAmount: degreeCSCourse.fees
        });
      }
      console.log('Database Seeding Completed successfully!');
    } else {
      console.log('Database already has records. Seeding skipped.');
    }
  } catch (err) {
    console.error('Error seeding database collections:', err.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
