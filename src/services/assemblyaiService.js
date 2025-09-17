require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const API_KEY = process.env.ASSEMBLYAI_API_KEY;
// console.log('AssemblyAI API Key:', API_KEY);

exports.transcribeFile = async (filePath) => {
  // Upload file to AssemblyAI
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const uploadRes = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    form,
    {
      headers: {
        ...form.getHeaders(),
        authorization: API_KEY,
      },
    }
  );

  // console.log('Upload response:', uploadRes.data); // Debugging line to check the upload response

  const audio_url = uploadRes.data.upload_url;

  const transcriptRes = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    { audio_url },
    { headers: { authorization: API_KEY } }
  );

  const transcriptId = transcriptRes.data.id;

  // Poll for completion
  let completed = false;
  let transcriptText = "";
  while (!completed) {
    const pollingRes = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: API_KEY } }
    );
    if (pollingRes.data.status === "completed") {
      completed = true;
      transcriptText = pollingRes.data.text;
    } else if (pollingRes.data.status === "failed") {
      throw new Error("Transcription failed");
    } else {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return transcriptText;
};
