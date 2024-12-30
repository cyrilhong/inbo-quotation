const { exec } = require('child_process');

const startPort = 3000; // Starting port
const numberOfPortsToCheck = 10; // Number of ports to check

function generatePortRange(start, count) {
  return Array.from({ length: count }, (_, i) => start + i);
}

const ports = generatePortRange(startPort, numberOfPortsToCheck);

function checkPort(portIndex) {
  if (portIndex >= ports.length) {
    console.log('No available ports found.');
    return;
  }

  const port = ports[portIndex];
  
  exec(`lsof -i :${port}`, (error, stdout) => {
    if (stdout) {
      console.log(`Port ${port} is occupied. Checking next port...`);
      checkPort(portIndex + 1); // Check the next port
    } else {
      console.log(`Starting on port ${port}...`);
      exec(`PORT=${port} react-scripts start`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
}

// Start checking from the first port
checkPort(0);