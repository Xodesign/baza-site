import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Routes
import objectsRouter from "./routes/objects.js";
import callsRouter from "./routes/calls.js";
import staffRouter from "./routes/staff.js";
import costsRouter from "./routes/costs.js";
import systemsRouter from "./routes/systems.js";
import toolsRouter from "./routes/tools.js";
import transportRouter from "./routes/transport.js";
import buyRouter from "./routes/buy.js";
import invoicesRouter from "./routes/invoices.js";
import contactsRouter from "./routes/contacts.js";
import activationsRouter from "./routes/activations.js";
import timeRouter from "./routes/time.js";
import wishesRouter from "./routes/wishes.js";
import sectionsRouter from "./routes/sections.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Request logging
app.use((_req, _res, next) => {
	console.log(`${new Date().toISOString()} - ${_req.method} ${_req.url}`);
	next();
});

// API Routes
app.use("/api/objects", objectsRouter);
app.use("/api/calls", callsRouter);
app.use("/api/staff", staffRouter);
app.use("/api/costs", costsRouter);
app.use("/api/systems", systemsRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/transport", transportRouter);
app.use("/api/buy", buyRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/activations", activationsRouter);
app.use("/api/time", timeRouter);
app.use("/api/wishes", wishesRouter);
app.use("/api/sections", sectionsRouter);

// Health check
app.get("/api/health", (_req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Info
app.get("/api", (_req, res) => {
	res.json({
		name: "CRM Backend API",
		version: "1.0.0",
		endpoints: [
			"/api/objects",
			"/api/calls",
			"/api/staff",
			"/api/costs",
			"/api/systems",
			"/api/tools",
			"/api/transport",
			"/api/buy",
			"/api/invoices",
			"/api/contacts",
			"/api/activations",
			"/api/time",
			"/api/wishes",
		],
	});
});

// Error handling
app.use((err, _req, res, _next) => {
	console.error("Error:", err);
	res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
