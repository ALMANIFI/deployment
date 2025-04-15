const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Initialize the app
const app = express();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Middleware to serve static files (like HTML, CSS, JS)
app.use(express.static("public"));

// Handle containerization request
app.post("/containerize", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.resolve(req.file.path);
  const imageName = `custom-container-${Date.now()}`;

  // Generate Dockerfile content
  const dockerfileContent = `
    FROM ${req.body.baseImage || 'ubuntu:latest'}
    COPY ${filePath} /app
    RUN ${req.body.dependencies || 'apt-get update'}
    CMD ["${req.body.startCommand || 'bash'}"]
  `;

  // Write Dockerfile to a temporary file
  const dockerfilePath = path.join(__dirname, "Dockerfile");
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  // Run the Docker build command
  const dockerCommand = `docker build -t ${imageName} -f ${dockerfilePath} .`;

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).send("Failed to containerize the file.");
    }
    console.log(`Docker Output: ${stdout}`);
    res.send(`File containerized successfully as ${imageName}`);
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
