const assemblyaiStreamingService = require('../services/assemblyaiStreamingService');

exports.handleStream = (ws, req) => {
  assemblyaiStreamingService.startStreaming(ws);
};