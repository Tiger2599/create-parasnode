#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const OFFICE = path.join(__dirname, "office_use");
const OFFICE_MODULE = path.join(__dirname, "office_use_module");
const INTERVIEW_MSSQL = path.join(__dirname, "interview_use_mssql");
const INTERVIEW_MYSQL = path.join(__dirname, "interview_use_mysql");
const INTERVIEW_MONGO = path.join(__dirname, "interview_use_mongo");

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
  console.log("Welcome to node project creator!");

  // Ask for the boilerplate type
  console.log("\nChoose a boilerplate:");
  console.log("  1. Office Use");
  console.log("  2. Interview (MSSQL)");
  console.log("  3. Interview (MySQL)");
  console.log("  4. Interview (Mongo)");
  console.log("  5. Office Use (module)");

  const templateChoice = await askQuestion("Enter your choice (1-4): ");

  let templateDir;
  switch (templateChoice) {
    case "1":
      templateDir = OFFICE;
      break;
    case "2":
      templateDir = INTERVIEW_MSSQL;
      break;
    case "3":
      templateDir = INTERVIEW_MYSQL;
      break;
    case "4":
      templateDir = INTERVIEW_MONGO;
      break;
    case "5":
      templateDir = OFFICE_MODULE;
      break;
    default:
      console.error("Invalid choice. Exiting...");
      process.exit(1);
  }

  // Ask for the project name
  const projectName = await askQuestion("What is your project name? (default: node-app): ");
  const projectDir = path.join(process.cwd(), projectName || "node-app");

  // Create the project folder
  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }
  fs.mkdirSync(projectDir);

  // Copy the template files
  console.log("Creating a new node project...");
  copyTemplateFiles(templateDir, projectDir);

  // Install dependencies
  console.log("Installing dependencies...");
  execSync("npm install", { stdio: "inherit", cwd: projectDir });

  console.log("✅ Project created successfully!");
  console.log(`\nRun the following commands to get started:`);
  console.log(`\n  cd ${projectName || "node-app"}`);
  console.log("  npm start");
}

main();
