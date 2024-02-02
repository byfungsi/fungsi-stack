import winston from "winston";
import "winston-daily-rotate-file";

const combinedFileTransport = new winston.transports.DailyRotateFile({
  filename: "combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  dirname: "logs",
  maxFiles: "3d",
});
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "3d",
  level: "error",
  dirname: "logs",
});
const exceptionFileTransport = new winston.transports.DailyRotateFile({
  filename: "exception-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "3d",
  level: "exception",
  dirname: "logs",
});
const rejectionFileTransport = new winston.transports.DailyRotateFile({
  filename: "rejection-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "3d",
  level: "rejection",
  dirname: "logs",
});

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: "info",
  format: winston.format.cli(),
  silent: process.env.NODE_ENV === "test",
  transports: [
    new winston.transports.Console(),
    combinedFileTransport,
    errorFileTransport,
  ],
  exceptionHandlers: [exceptionFileTransport],
  rejectionHandlers: [rejectionFileTransport],
});

logger.exitOnError = false;

export default logger;
