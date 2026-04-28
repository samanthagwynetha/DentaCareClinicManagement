import winston from "winston";

// ============================================
// STRUCTURED LOGGING SETUP
// ============================================
// This logger provides structured JSON output that can be:
// - Parsed by monitoring tools (New Relic, Datadog, Splunk)
// - Searched and filtered in production
// - Traced across multiple services
// - Archived for compliance

const logLevel = process.env.LOG_LEVEL || "info";
const isTest = process.env.NODE_ENV === "test";

// Define log levels (lower number = more severe)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Color coding for console output during development
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

winston.addColors(colors);

// Console transport for development (readable format)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(
      ({ timestamp, level, message, module, requestId, ...metadata }) => {
        let log = `[${timestamp}] ${level}: ${message}`;
        if (module) log += ` [${module}]`;
        if (requestId) log += ` (${requestId})`;
        if (Object.keys(metadata).length > 0) {
          log += ` ${JSON.stringify(metadata)}`;
        }
        return log;
      }
    )
  ),
});

// JSON transport for production (structured, machine-readable)
const jsonTransport = new winston.transports.File({
  filename: "logs/app.log",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Error log file (only errors)
const errorTransport = new winston.transports.File({
  filename: "logs/error.log",
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  silent: isTest,
  levels,
  transports: [
    consoleTransport,
    ...(process.env.NODE_ENV === "production"
      ? [jsonTransport, errorTransport]
      : []),
  ],
});

export default logger;
