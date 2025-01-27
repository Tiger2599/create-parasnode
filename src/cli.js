#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const TEMPLATE_DIR = path.join(__dirname, "templates");

function copyTemplateFiles(templateDir, targetDir) {
  if (!fs.existsSync(templateDir)) {
    console.error("Template directory does not exist.");
    process.exit(1);
  }

  fs.readdirSync(templateDir).forEach((file) => {
    const srcFile = path.join(templateDir, file);
    const targetFile = path.join(targetDir, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      fs.mkdirSync(targetFile, { recursive: true });
      copyTemplateFiles(srcFile, targetFile);
    } else {
      fs.copyFileSync(srcFile, targetFile);
    }
  });
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  console.log("Welcome to ParasNode project creator!");

  // Ask for the project name
  const projectName = await askQuestion("What is your project name? (default: parasnode-app): ");
  const projectDir = path.join(process.cwd(), projectName || "parasnode-app");

  // Create the project folder
  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }
  fs.mkdirSync(projectDir);

  // Copy the template files
  console.log("Creating a new ParasNode project...");
  copyTemplateFiles(TEMPLATE_DIR, projectDir);

  // Install dependencies
  console.log("Installing dependencies...");
  execSync("npm install", { stdio: "inherit", cwd: projectDir });

  console.log("Project created successfully!");
  console.log(`\nRun the following commands to get started:`);
  console.log(`\n  cd ${projectName || "parasnode-app"}`);
  console.log("  npm start");
}

main();
