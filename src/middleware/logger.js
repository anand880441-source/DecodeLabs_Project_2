// ===== Request Logger =====
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capture original send to log after response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const logEntry = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // Log to console with color coding
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : 
                        res.statusCode >= 300 ? '\x1b[33m' : 
                        '\x1b[32m';
    
    console.log(
      `${statusColor}${res.statusCode}\x1b[0m`,
      `\x1b[36m${req.method}\x1b[0m`,
      req.path,
      `\x1b[90m${duration}\x1b[0m`
    );
    
    // Could also write to a log file here
    // fs.appendFileSync('logs/requests.log', JSON.stringify(logEntry) + '\n');
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = { requestLogger };