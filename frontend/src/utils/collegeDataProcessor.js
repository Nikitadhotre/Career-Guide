import fs from 'fs';
import path from 'path';

// Function to process CSV data
const processCSVData = () => {
  try {
    const csvPath = path.join(process.cwd(), '..', 'src', 'assets', 'colleges.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('⚠️ CSV file not found');
      return null;
    }
    
    const rawData = fs.readFileSync(csvPath, 'utf8');
    const lines = rawData.split('\n');
    
    if (lines.length < 2) {
      console.log('⚠️ CSV file is empty or invalid');
      return null;
    }
    
    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse data rows
    const colleges = [];
    for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Process first 1000 rows
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      if (values.length !== headers.length) continue;
      
      const college = {};
      headers.forEach((header, index) => {
        college[header] = values[index] || '';
      });
      
      colleges.push(college);
    }
    
    return colleges;
  } catch (error) {
    console.error('❌ Error processing CSV data:', error);
    return null;
  }
};

// Helper function to parse CSV line (handles commas within quotes)
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
};

// Function to convert CSV data to our schema format
const convertCSVToSchema = (csvData) => {
  if (!csvData || csvData.length === 0) {
    return [];
  }
  
  return csvData.map((college, index) => {
    // Extract college name from the college field (remove ID part)
    const collegeName = college.college ? college.college.split('(Id:')[0].trim() : `College ${index + 1}`;
    
    // Extract location information
    const location = {
      state: college.state || 'Unknown',
      city: college.district || 'Unknown',
      address: `${college.district || 'Unknown'}, ${college.state || 'Unknown'}`
    };

    // Determine stream based on college type and name
    const collegeType = college.college_type || '';
    const collegeNameLower = collegeName.toLowerCase();
    let stream = 'Science'; // Default
    
    if (collegeType.includes('Engineering') || collegeNameLower.includes('engineering') || collegeNameLower.includes('tech')) {
      stream = 'Engineering';
    } else if (collegeType.includes('Medical') || collegeNameLower.includes('medical') || collegeNameLower.includes('health')) {
      stream = 'Medical';
    } else if (collegeType.includes('Arts') || collegeNameLower.includes('arts') || collegeNameLower.includes('humanities')) {
      stream = 'Arts';
    } else if (collegeType.includes('Commerce') || collegeNameLower.includes('commerce') || collegeNameLower.includes('business')) {
      stream = 'Commerce';
    } else if (collegeType.includes('Law') || collegeNameLower.includes('law') || collegeNameLower.includes('legal')) {
      stream = 'Law';
    } else if (collegeType.includes('Management') || collegeNameLower.includes('management') || collegeNameLower.includes('admin')) {
      stream = 'Management';
    } else if (collegeType.includes('Design') || collegeNameLower.includes('design') || collegeNameLower.includes('creative')) {
      stream = 'Design';
    } else if (collegeType.includes('IT') || collegeNameLower.includes('it') || collegeNameLower.includes('computer')) {
      stream = 'IT';
    } else if (collegeType.includes('Agriculture') || collegeNameLower.includes('agriculture') || collegeNameLower.includes('farming')) {
      stream = 'Agriculture';
    }
    
    // Generate courses based on stream
    const courses = [{
      name: `${stream} Course`,
      duration: stream === 'Engineering' || stream === 'Medical' ? '4 years' : '3 years',
      fees: Math.floor(Math.random() * 500000) + 50000,
      seats: Math.floor(Math.random() * 200) + 50
    }];
    
    // Generate interest tags
    const interestTags = generateInterestTags([`${stream} Course`], [stream]);

    return {
      name: collegeName,
      location,
      courses,
      streams: [stream],
      interestTags,
      rank: Math.floor(Math.random() * 1000) + 1,
      rating: (Math.random() * 2 + 3).toFixed(1),
      website: '',
      phone: '',
      email: '',
      description: `A ${collegeType.toLowerCase()} offering quality education in ${stream}`,
      facilities: ['Library', 'Laboratory', 'Sports Complex', 'Cafeteria'],
      admissionCriteria: 'Based on merit and entrance examination',
      isActive: true
    };
  });
};

// Function to process the college data (CSV priority, then JSON, then fallback)
export const processCollegeData = () => {
  try {
    // First try to process CSV data
    const csvPath = path.join(process.cwd(), '..', 'src', 'assets', 'colleges.csv');
    if (fs.existsSync(csvPath)) {
      console.log('📊 Processing CSV college data...');
      const csvData = processCSVData();
      if (csvData && csvData.length > 0) {
        const processedColleges = convertCSVToSchema(csvData);
        console.log(`✅ Successfully processed ${processedColleges.length} colleges from CSV`);
        return processedColleges;
      }
    }
    
    // Fallback to JSON if CSV fails
    const jsonPath = path.join(process.cwd(), '..', 'src', 'assets', 'colleges.json');
    if (fs.existsSync(jsonPath)) {
      console.log('📊 Processing JSON college data...');
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      
      // Try to parse the JSON with error handling
      let colleges;
      try {
        colleges = JSON.parse(rawData);
      } catch (parseError) {
        console.log('⚠️ JSON parsing failed, using fallback data');
        return getFallbackColleges();
      }
      
      if (!Array.isArray(colleges) || colleges.length === 0) {
        console.log('⚠️ Invalid college data structure, using fallback data');
        return getFallbackColleges();
      }
      
      // Process and transform the data to match our schema
      const processedColleges = colleges.map((college, index) => {
        // Extract location information
        const location = {
          state: college.state || college.State || 'Unknown',
          city: college.city || college.City || 'Unknown',
          address: college.address || college.Address || college.location || ''
        };

        // Extract courses and streams
        const rawCourses = Array.isArray(college.courses) ? college.courses : 
                          Array.isArray(college.Courses) ? college.Courses : [];
        const rawStreams = Array.isArray(college.streams) ? college.streams : 
                          Array.isArray(college.Streams) ? college.Streams : [];
        
        // Convert courses to proper format
        const courses = rawCourses.length > 0 ? rawCourses.map(course => {
          if (typeof course === 'string') {
            return {
              name: course,
              duration: '4 years',
              fees: Math.floor(Math.random() * 500000) + 50000,
              seats: Math.floor(Math.random() * 200) + 50
            };
          }
          return course;
        }) : [{
          name: 'General Course',
          duration: '4 years',
          fees: 100000,
          seats: 100
        }];
        
        // Convert streams to valid enum values
        const validStreams = ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science', 'Law', 'Management', 'Design', 'IT', 'Agriculture'];
        const streams = rawStreams.length > 0 ? rawStreams
          .map(stream => {
            const streamLower = stream.toLowerCase();
            if (streamLower.includes('engineering') || streamLower.includes('tech')) return 'Engineering';
            if (streamLower.includes('medical') || streamLower.includes('health')) return 'Medical';
            if (streamLower.includes('arts') || streamLower.includes('humanities')) return 'Arts';
            if (streamLower.includes('commerce') || streamLower.includes('business')) return 'Commerce';
            if (streamLower.includes('science')) return 'Science';
            if (streamLower.includes('law') || streamLower.includes('legal')) return 'Law';
            if (streamLower.includes('management') || streamLower.includes('admin')) return 'Management';
            if (streamLower.includes('design') || streamLower.includes('creative')) return 'Design';
            if (streamLower.includes('it') || streamLower.includes('computer')) return 'IT';
            if (streamLower.includes('agriculture') || streamLower.includes('farming')) return 'Agriculture';
            return 'Science'; // Default fallback
          })
          .filter((stream, index, arr) => arr.indexOf(stream) === index) // Remove duplicates
          .filter(stream => validStreams.includes(stream)) // Only keep valid streams
        : ['Science'];
        
        // Generate interest tags based on courses and streams
        const interestTags = generateInterestTags(rawCourses, rawStreams);

        return {
          name: college.name || college.Name || college.institution_name || `College ${index + 1}`,
          location,
          courses,
          streams,
          interestTags,
          rank: college.rank || college.Rank || Math.floor(Math.random() * 1000) + 1,
          rating: college.rating || college.Rating || (Math.random() * 2 + 3).toFixed(1),
          website: college.website || college.Website || college.url || '',
          phone: college.phone || college.Phone || college.contact || '',
          email: college.email || college.Email || '',
          description: college.description || college.Description || `A prestigious institution offering quality education in ${streams.join(', ')}`,
          facilities: Array.isArray(college.facilities) ? college.facilities : ['Library', 'Laboratory', 'Sports Complex', 'Cafeteria'],
          admissionCriteria: college.admissionCriteria || college.AdmissionCriteria || 'Based on merit and entrance examination',
          isActive: true
        };
      });

      return processedColleges;
    }
    
    // If neither CSV nor JSON works, use fallback data
    console.log('⚠️ No data files found, using fallback data');
    return getFallbackColleges();
    
  } catch (error) {
    console.error('❌ Error processing college data:', error);
    return getFallbackColleges();
  }
};

// Fallback college data
const getFallbackColleges = () => {
  return [
    {
      name: "Rajiv Gandhi University",
      location: {
        state: "Arunachal Pradesh",
        city: "Itanagar",
        address: "Rono Hills P.O. Doimukh, Itanagar, Arunachal Pradesh - 791112"
      },
      courses: [
        {
          name: "Computer Science",
          duration: "4 years",
          fees: 150000,
          seats: 120
        },
        {
          name: "Engineering",
          duration: "4 years",
          fees: 180000,
          seats: 150
        },
        {
          name: "Arts",
          duration: "3 years",
          fees: 80000,
          seats: 200
        },
        {
          name: "Science",
          duration: "3 years",
          fees: 100000,
          seats: 180
        }
      ],
      streams: ["Engineering", "Arts", "Science"],
      interestTags: ["Technology", "Engineering", "Arts", "Science"],
      rank: 1,
      rating: 4.2,
      website: "http://www.rgu.ac.in",
      phone: "0360-2277253",
      email: "",
      description: "Central University in Arunachal Pradesh offering diverse academic programs",
      facilities: ["Library", "Laboratory", "Sports Complex", "Hostel"],
      admissionCriteria: "Merit-based and entrance examination",
      isActive: true
    },
    {
      name: "Indian Institute of Technology Bombay",
      location: {
        state: "Maharashtra",
        city: "Mumbai",
        address: "Powai, Mumbai, Maharashtra 400076"
      },
      courses: [
        {
          name: "Computer Science",
          duration: "4 years",
          fees: 250000,
          seats: 120
        },
        {
          name: "Mechanical Engineering",
          duration: "4 years",
          fees: 220000,
          seats: 150
        },
        {
          name: "Electrical Engineering",
          duration: "4 years",
          fees: 230000,
          seats: 130
        }
      ],
      streams: ["Engineering"],
      interestTags: ["Technology", "Engineering", "Computer Science", "Innovation"],
      rank: 2,
      rating: 4.8,
      website: "https://www.iitb.ac.in",
      phone: "+91-22-25722545",
      email: "info@iitb.ac.in",
      description: "Premier engineering institution known for excellence in technology and research",
      facilities: ["Modern Labs", "Library", "Sports Complex", "Hostel"],
      admissionCriteria: "JEE Advanced",
      isActive: true
    }
  ];
};

// Function to generate interest tags based on courses and streams
const generateInterestTags = (courses, streams) => {
  const tags = new Set();
  
  // Add tags based on streams
  streams.forEach(stream => {
    const streamLower = stream.toLowerCase();
    if (streamLower.includes('computer') || streamLower.includes('it')) {
      tags.add('Technology');
      tags.add('Programming');
    }
    if (streamLower.includes('engineering')) {
      tags.add('Engineering');
      tags.add('Technology');
    }
    if (streamLower.includes('medical') || streamLower.includes('health')) {
      tags.add('Healthcare');
      tags.add('Medicine');
    }
    if (streamLower.includes('business') || streamLower.includes('management')) {
      tags.add('Business');
      tags.add('Management');
    }
    if (streamLower.includes('arts') || streamLower.includes('humanities')) {
      tags.add('Arts');
      tags.add('Humanities');
    }
    if (streamLower.includes('science')) {
      tags.add('Science');
      tags.add('Research');
    }
    if (streamLower.includes('law')) {
      tags.add('Law');
      tags.add('Legal');
    }
    if (streamLower.includes('education')) {
      tags.add('Education');
      tags.add('Teaching');
    }
  });

  // Add tags based on courses
  courses.forEach(course => {
    const courseLower = course.toLowerCase();
    if (courseLower.includes('ai') || courseLower.includes('artificial intelligence')) {
      tags.add('AI');
      tags.add('Technology');
    }
    if (courseLower.includes('data') || courseLower.includes('analytics')) {
      tags.add('Data Science');
      tags.add('Analytics');
    }
    if (courseLower.includes('design')) {
      tags.add('Design');
      tags.add('Creative');
    }
    if (courseLower.includes('finance') || courseLower.includes('accounting')) {
      tags.add('Finance');
      tags.add('Business');
    }
    if (courseLower.includes('marketing')) {
      tags.add('Marketing');
      tags.add('Business');
    }
  });

  return Array.from(tags);
};

// Function to get sample colleges for development/testing
export const getSampleColleges = (count = 50) => {
  const allColleges = processCollegeData();
  return allColleges.slice(0, count);
};

// Function to get colleges by state
export const getCollegesByState = (state) => {
  const allColleges = processCollegeData();
  return allColleges.filter(college => 
    college.location.state.toLowerCase().includes(state.toLowerCase())
  );
};

// Function to get colleges by stream
export const getCollegesByStream = (stream) => {
  const allColleges = processCollegeData();
  return allColleges.filter(college => 
    college.streams.some(s => s.toLowerCase().includes(stream.toLowerCase()))
  );
};

// Function to get colleges by interest tags
export const getCollegesByTags = (tags) => {
  const allColleges = processCollegeData();
  return allColleges.filter(college => 
    tags.some(tag => college.interestTags.includes(tag))
  );
}; 