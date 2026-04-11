const fs = require('fs');

const filesToFix = [
  "Backend/src/server.js",
  "Backend/src/routes/auth.route.js",
  "Backend/src/routes/message.route.js",
  "Backend/src/models/message.model.js",
  "Backend/src/models/User.js",
  "Backend/src/lib/db.js",
  "Backend/src/middleware/auth.js",
  "Backend/src/controllers/auth.controller.js",
  "Frontend/index.html",
  "Frontend/src/App.jsx",
  "Frontend/src/index.css",
  "Frontend/src/main.jsx"
];

for (const file of filesToFix) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Most files have a giant block of newlines separating the old and new code (e.g. \n\n\n\n\n\n\n)
    // We can split by 4+ newlines
    let parts = content.split(/\n{4,}/);
    if (parts.length > 1) {
      if (parts[parts.length - 1].trim().length > 0) {
        fs.writeFileSync(file, parts[parts.length - 1].trimStart());
        console.log("Fixed " + file + " by extracting the bottom chunk.");
      }
    } else {
      console.log("Skipping " + file + " (no large newline chunk found).");
    }
  } catch(e) {
    console.error("Error reading " + file + ":", e.message);
  }
}
