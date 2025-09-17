const WebSocket = require("ws");
require("dotenv").config();
const { saveTranscript } = require("./supabaseService");

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_REALTIME_URL =
  "wss://streaming.assemblyai.com/v3/ws?sample_rate=16000";

function startStreaming(clientWs, userId) {

  // console.log("[AssemblyAI] Starting streaming session...");

  // Connect to AssemblyAI Realtime WebSocket
  const assemblyWs = new WebSocket(ASSEMBLYAI_REALTIME_URL, {
    headers: { Authorization: ASSEMBLYAI_API_KEY },
  });

  let assemblyReady = false;
  let bufferQueue = [];

  assemblyWs.on("open", () => {

    // console.log("[AssemblyAI] WebSocket connection established.");
    assemblyReady = true;

    // Flush any queued audio chunks
    bufferQueue.forEach((chunk, i) => {
      sendAudioToAssembly(assemblyWs, chunk, i + 1);
    });
    bufferQueue = [];
  });

  assemblyWs.on("message", async (data) => {
    let msgStr = data instanceof Buffer ? data.toString("utf-8") : data;
    

    try {
      const msg = JSON.parse(msgStr);

      if (msg.type === "Turn" || msg.type === "FinalTranscript") {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ transcript: msg.text, message: msg }));
     

          if (userId && msg.message_type === "FinalTranscript" && msg.text) {
            const defaultTitle = msg.text.split(' ').slice(0, 5).join(' ') + '...'; 

            await saveTranscript({ user_id: userId, text: msg.text,title:defaultTitle });
            // console.log("[Supabase] Saved transcript for user:", userId);
          }
        }
      }
    } catch (err) {
      console.error("[AssemblyAI] Error parsing message:", err, msgStr);
    }
  });

  assemblyWs.on("close", (code, reason) => {
    console.log(`[AssemblyAI] WebSocket closed: ${code} - ${reason}`);
  });

  assemblyWs.on("error", (err) => {
    console.error("[AssemblyAI] WebSocket error:", err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: "AssemblyAI connection error" }));
    }
  });

  // Client sends PCM chunks here
  clientWs.on("message", (audioChunk) => {
    // console.log("[Client] Received audio chunk:", audioChunk.byteLength || audioChunk.length);

    let parsed;
    try {
      parsed = JSON.parse(audioChunk);
    } catch (_) {}

    if (parsed?.terminate_session) {
      // console.log("[Client] Session termination requested.");
      if (assemblyReady) {
        assemblyWs.send(JSON.stringify({ terminate_session: true }));
        assemblyWs.close();
      }
      return;
    }

    if (assemblyReady) {
      sendAudioToAssembly(assemblyWs, audioChunk);
    } else {
      bufferQueue.push(audioChunk);
      // console.log("[AssemblyAI] Buffered chunk (WS not ready)");
    }
  });

  clientWs.on("close", () => {
    // console.log("[Client] WebSocket closed.");
    if (assemblyReady) {
      assemblyWs.send(JSON.stringify({ terminate_session: true }));
      assemblyWs.close();
    }
  });

  clientWs.on("error", (err) => {
    console.error("[Client] WebSocket error:", err);
    assemblyWs.close();
  });
}

function sendAudioToAssembly(ws, chunk, index = null) {
  // Forward raw binary directly without base64 or JSON
  ws.send(chunk);
  // console.log(`[AssemblyAI] Sent chunk${index ? ` #${index}` : ""}, size: ${chunk.length || chunk.byteLength}`);
}

module.exports = { startStreaming };
