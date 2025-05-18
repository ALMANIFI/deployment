document.addEventListener("DOMContentLoaded", function () {
    // const fileInput = document.getElementById("fileInput");
    let folderPath= "";

    const dockerfileButton = document.getElementById("dockerfileButton");
    const addConfigs = document.getElementById("addConfigs");
    const file = document.getElementById("file");
    const dockerfileInputs = document.getElementById("dockerfileInputs");
    const generateDockerfileButton = document.getElementById("generateDockerfileButton");
    const resultDiv = document.getElementById("result");
    const { webUtils } = require('electron')
    const { ipcRenderer } = require('electron/renderer')

    dockerfileButton.addEventListener("click", async function () {
        // Use Electron's ipcRenderer to call the main process function
        
        try {
            folderPath = await ipcRenderer.invoke('open-dialog');
            if (folderPath) {
                console.log(folderPath);
                          }
        } catch (error) {
            console.error('Failed to open dialog:', error);
      }

      file.innerHTML = folderPath;

      if (folderPath.length) {
      addConfigs.disabled = false;
      return;
    }});

  addConfigs.addEventListener("click", function () {
    
    // Check if a file is selected
    if (!folderPath.length) {
      alert("Please select a file to containerize.");
      return;
    }
    dockerfileInputs.style.display = "block";

    addConfigs.style.display = "none";
    dockerfileButton.style.display = "none";
    file.style.display = "none";
  });

  generateDockerfileButton.addEventListener("click", function () {
    var fs = require("fs");
    let data = `FROM ${document.getElementById("baseImage").value}\n`+
    `COPY ${document.getElementById("copyFile").value} /app\n`+
    `RUN ${document.getElementById("dependencies").value}\n`+
    `CMD ["${document.getElementById("command").value}"]\n`+
    `EXPOSE ${document.getElementById("ports").value}\n`
    ;

    try {
      fs.writeFileSync(`${folderPath}\\dockerfile`, data);
      alert("Dockerfile created successfully!");
      location.reload(); // Refreshes the page after alert is dismissed

    } catch (error) {
      console.error("Error creating Dockerfile:", error);
      alert("Failed to create Dockerfile. Check console for details.");
    }
  });
});


































































// document.addEventListener("DOMContentLoaded", function () {
//   const fileInput = document.getElementById("fileInput");
//   const createContainerButton = document.getElementById("createContainerButton");
//   const dockerfileInputs = document.getElementById("dockerfileInputs");
//   const generateDockerfileButton = document.getElementById("generateDockerfileButton");
//   const resultDiv = document.getElementById("result");

//   const copyFileContainer = document.getElementById("copyFileContainer");
//   const addCopyFileButton = document.getElementById("addCopyFileButton");

//   const dependenciesContainer = document.getElementById("dependenciesContainer");
//   const addDependenciesButton = document.getElementById("addDependenciesButton");

//   const portsContainer = document.getElementById("portsContainer");
//   const addPortsButton = document.getElementById("addPortsButton");

//   // Show the Dockerfile form when the "Containerize File" button is clicked
//   createContainerButton.addEventListener("click", function () {
//     // Check if a file is selected
//     if (!fileInput.files.length) {
//       alert("Please select a file to containerize.");
//       return;
//     }

//     // Show the Dockerfile generation form
//     dockerfileInputs.style.display = "block";
//   });

//   // Add more input fields for "Copy File"
//   addCopyFileButton.addEventListener("click", function () {
//     const newInput = document.createElement("input");
//     newInput.type = "text";
//     newInput.placeholder = "e.g., ./app /app";
//     newInput.required = true;
//     newInput.className = "form-control mb-2";
//     copyFileContainer.appendChild(newInput);
//   });

//   // Add more input fields for "Dependencies"
//   addDependenciesButton.addEventListener("click", function () {
//     const newInput = document.createElement("input");
//     newInput.type = "text";
//     newInput.placeholder = "e.g., apt-get update && apt-get install -y python";
//     newInput.required = true;
//     newInput.className = "form-control mb-2";
//     dependenciesContainer.appendChild(newInput);
//   });

//   // Add more input fields for "Ports"
//   addPortsButton.addEventListener("click", function () {
//     const newInput = document.createElement("input");
//     newInput.type = "number";
//     newInput.placeholder = "e.g., 8080";
//     newInput.required = true;
//     newInput.className = "form-control mb-2";
//     portsContainer.appendChild(newInput);
//   });

//   // Handle the generation of the Dockerfile
//   generateDockerfileButton.addEventListener("click", function () {
//     const baseImage = document.getElementById("baseImage").value;

//     // Collect all "Copy File" inputs
//     const copyFileInputs = copyFileContainer.querySelectorAll("input");
//     const copyFiles = Array.from(copyFileInputs).map(input => input.value);

//     // Collect all "Dependencies" inputs
//     const dependenciesInputs = dependenciesContainer.querySelectorAll("input");
//     const dependencies = Array.from(dependenciesInputs).map(input => input.value);

//     // Collect all "Ports" inputs
//     const portsInputs = portsContainer.querySelectorAll("input");
//     const ports = Array.from(portsInputs).map(input => input.value);

//     const command = document.getElementById("command").value;

//     // Check if all fields are filled
//     if (!baseImage || copyFiles.some(file => !file) || dependencies.some(dep => !dep) || ports.some(port => !port) || !command) {
//       alert("Please fill in all the fields.");
//       return;
//     }

//     // Prepare the form data to send to the server
//     const formData = new FormData();
//     for (const file of fileInput.files) {
//       formData.append("files[]", file); // Append all files in the folder
//     }
//     formData.append("baseImage", baseImage);
//     formData.append("copyFiles", JSON.stringify(copyFiles)); // Send as JSON string
//     formData.append("dependencies", JSON.stringify(dependencies)); // Send as JSON string
//     formData.append("ports", JSON.stringify(ports)); // Send as JSON string
//     formData.append("command", command);

//     // Send the form data to the server for processing
//     fetch("/containerize", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         resultDiv.innerHTML = `<p><strong>Success:</strong> ${data.message}</p>`;
//       })
//       .catch((error) => {
//         resultDiv.innerHTML = `<p><strong>Error:</strong> ${error}</p>`;
//       });
//   });
// });
