import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }


const { exec } = require('child_process');

// Replace 'python_script.py' with the path to your Python script.
const pythonScriptPath = './pages/api/application.py';

// Construct the command to run the Python script with arguments.
const command = `python3 ${pythonScriptPath} ${animal}`;

//Execute the Python script from Node.js
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Python script: ${error}`);
    return;
  }

  console.log('Python script output:');
  console.log(stdout);

  res.status(200).json({Result:stdout})
});

