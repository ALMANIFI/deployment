document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const createContainerButton = document.getElementById("createContainerButton");

  createContainerButton.addEventListener("click", () => {
    // Check if a file is selected
    if (!fileInput.files.length) {
      alert("Please select a file to containerize.");
      return;
    }

    const file = fileInput.files[0];
    alert(`File "${file.name}" selected. Starting containerization...`);

    // Simulate containerization process
    // Replace this with an API call to your backend to handle Docker commands
    console.log(`Containerizing file: ${file.name}`);
    setTimeout(() => {
      alert(`File "${file.name}" has been successfully containerized!`);
    }, 2000);
  });
});

const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/containerize", upload.single("file"), (req, res) => {
  const filePath = path.resolve(req.file.path);
  const imageName = `custom-container:${Date.now()}`;

  // Docker command to containerize the file
  const dockerCommand = `docker build -t ${imageName} -f ${filePath} .`;

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).send("Failed to containerize the file.");
    }
    console.log(`Docker Output: ${stdout}`);
    res.send(`File containerized successfully as ${imageName}`);
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});