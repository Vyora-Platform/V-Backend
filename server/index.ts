import dotenv from "dotenv";
dotenv.config();

// Allow self-signed certificates for Supabase pooler connections
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";


// Configure CORS - allow requests from client dev server when running separately
const isSeparatedMode = process.env.SEPARATE_CLIENT === "true";

const allowedOrigins = isSeparatedMode
  ? [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://vyora.club/"
    ]
  : undefined;

const app = express();

if (allowedOrigins) {
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));
  log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}


// Increase body size limit to 50MB for handling image uploads and large forms
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Serve uploaded files from the uploads directory
  const uploadsDir = process.env.PUBLIC_OBJECT_SEARCH_PATHS?.split(",")[0];
  if (uploadsDir) {
    app.use('/uploads', express.static(uploadsDir));
    log(`Serving uploads from: ${uploadsDir}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Skip Vite setup if SEPARATE_CLIENT=true (for running client separately)
  if (app.get("env") === "development" && process.env.SEPARATE_CLIENT !== "true") {
    await setupVite(app, server);
  } else if (app.get("env") === "development" && process.env.SEPARATE_CLIENT === "true") {
    // When running separately, just serve API routes
    log("Running server only mode (client served separately)");
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
