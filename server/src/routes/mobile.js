import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { query } from "../db/db.js";

const router = express.Router();

const UPLOAD_DIR = "/var/www/uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
	fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
	destination: UPLOAD_DIR,
	filename: (_req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Map baza call row to mobile format
function mapCall(row) {
	return {
		id: row.id,
		phone: row.customer_contact || "",
		client_name: row.object_name || "",
		address: row.short_address || "",
		note: row.request || "",
		status: row.status || "new",
		call_type: row.type || "incoming",
		created_at: row.created_at,
		updated_at: row.updated_at,
		engineer: row.engineer || "",
		latitude: row.latitude || null,
		longitude: row.longitude || null,
	};
}

function mapRequest(row) {
	return {
		id: row.id,
		request_type: "procurement",
		title: row.what_to_buy || "Заявка",
		description: row.what_to_buy || "",
		priority: "normal",
		status: row.status === "new" ? "pending" : row.status || "pending",
		created_by: row.creator || null,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}

// ============ CALLS ============
router.get("/calls", async (_req, res) => {
	try {
		const result = await query("SELECT * FROM calls ORDER BY created_at DESC");
		res.json(result.rows.map(mapCall));
	} catch (error) {
		console.error("Error fetching mobile calls:", error);
		res.status(500).json({ error: "Failed to fetch calls" });
	}
});

router.get("/calls/:id", async (req, res) => {
	try {
		const result = await query("SELECT * FROM calls WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length === 0)
			return res.status(404).json({ error: "Call not found" });
		res.json(mapCall(result.rows[0]));
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch call" });
	}
});

router.post("/calls", async (req, res) => {
	try {
		const { phone, client_name, address, note, call_type, status } = req.body;
		const result = await query(
			`INSERT INTO calls (customer_contact, object_name, short_address, request, type, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
			[
				phone,
				client_name,
				address,
				note,
				call_type || "incoming",
				status || "new",
			],
		);
		res.status(201).json(mapCall(result.rows[0]));
	} catch (error) {
		console.error("Error creating mobile call:", error);
		res.status(500).json({ error: "Failed to create call" });
	}
});

router.put("/calls/:id", async (req, res) => {
	try {
		const { status, note, address, latitude, longitude } = req.body;
		const fields = ["updated_at = NOW()"];
		const vals = [];
		let i = 1;
		if (status !== undefined) {
			fields.push(`status = $${i++}`);
			vals.push(status);
		}
		if (note !== undefined) {
			fields.push(`request = $${i++}`);
			vals.push(note);
		}
		if (address !== undefined) {
			fields.push(`short_address = $${i++}`);
			vals.push(address);
		}
		if (latitude !== undefined) {
			fields.push(`latitude = $${i++}`);
			vals.push(latitude);
		}
		if (longitude !== undefined) {
			fields.push(`longitude = $${i++}`);
			vals.push(longitude);
		}
		vals.push(req.params.id);
		const result = await query(
			`UPDATE calls SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
			vals,
		);
		if (result.rows.length === 0)
			return res.status(404).json({ error: "Call not found" });
		res.json(mapCall(result.rows[0]));
	} catch (error) {
		console.error("Error updating mobile call:", error);
		res.status(500).json({ error: "Failed to update call" });
	}
});

// ============ CALL PHOTOS ============
router.get("/calls/:id/photos", async (req, res) => {
	try {
		const result = await query(
			"SELECT * FROM call_photos WHERE call_id = $1 ORDER BY created_at DESC",
			[req.params.id],
		);
		res.json(
			result.rows.map((p) => ({
				id: p.id,
				call_id: p.call_id,
				photo_url: p.photo_url,
				created_at: p.created_at,
			})),
		);
	} catch (error) {
		res.json([]);
	}
});

router.post(
	"/calls/:id/photos",
	upload.array("photos", 10),
	async (req, res) => {
		try {
			const files = req.files || [];
			const results = [];
			for (const file of files) {
				const photo_url = `/uploads/${file.filename}`;
				const result = await query(
					`INSERT INTO call_photos (call_id, photo_url, created_at)
         VALUES ($1, $2, NOW()) RETURNING *`,
					[req.params.id, photo_url],
				);
				results.push({
					id: result.rows[0].id,
					call_id: parseInt(req.params.id),
					photo_url,
					created_at: result.rows[0].created_at,
				});
			}
			res.status(201).json(results);
		} catch (error) {
			console.error("Error uploading photos:", error);
			res.status(500).json({ error: "Failed to upload photos" });
		}
	},
);

// ============ REQUESTS ============
router.get("/requests", async (_req, res) => {
	try {
		const result = await query("SELECT * FROM buy ORDER BY created_at DESC");
		res.json(result.rows.map(mapRequest));
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch requests" });
	}
});

router.post("/requests", async (req, res) => {
	try {
		const { title, description, created_by } = req.body;
		const result = await query(
			`INSERT INTO buy (what_to_buy, status, creator, created_at, updated_at)
       VALUES ($1, 'new', $2, NOW(), NOW()) RETURNING *`,
			[title || description, created_by],
		);
		res.status(201).json(mapRequest(result.rows[0]));
	} catch (error) {
		console.error("Error creating request:", error);
		res.status(500).json({ error: "Failed to create request" });
	}
});

// ============ TOOLS ============
router.get("/tools", async (_req, res) => {
	try {
		const result = await query("SELECT * FROM tools ORDER BY tool");
		res.json(
			result.rows.map((t) => ({
				id: t.id,
				name: t.tool || "",
				inventory_number: t.inventory_number || "",
				condition: t.call_status === "completed" ? "good" : "repair",
			})),
		);
	} catch (error) {
		console.error("Tools error:", error.message);
		res.json([]);
	}
});

// ============ TRANSPORT ============
router.get("/transport", async (_req, res) => {
	try {
		const result = await query("SELECT * FROM vehicles ORDER BY brand");
		res.json(
			result.rows.map((v) => ({
				id: v.id,
				brand: v.brand || "",
				model: v.model || "",
				plate_number: v.plate_number || "",
				status: v.status || "available",
			})),
		);
	} catch (error) {
		res.json([]);
	}
});

// ============ STAFF ============
router.get("/staff", async (_req, res) => {
	try {
		const result = await query("SELECT * FROM staff ORDER BY full_name");
		res.json(
			result.rows.map((u) => ({
				id: u.id,
				full_name: u.full_name || "",
				username: "",
				position: u.position || "",
				phone: u.phone || "",
				email: u.email || "",
			})),
		);
	} catch (error) {
		res.json([]);
	}
});

// ============ WORK SCHEDULE (work_days table) ============
router.get("/work-schedule", async (req, res) => {
	try {
		const { user_id } = req.query;
		let sql = "SELECT * FROM work_days";
		const params = [];
		if (user_id) {
			sql += " WHERE user_id = $1";
			params.push(user_id);
		}
		sql += " ORDER BY work_date DESC";
		const result = await query(sql, params);
		res.json(
			result.rows.map((w) => ({
				id: w.id,
				user_id: w.user_id,
				work_date: w.work_date,
				working: w.is_working !== false,
				start_time: w.start_time || "09:00",
				end_time: w.end_time || "18:00",
			})),
		);
	} catch (error) {
		console.error("Error fetching work schedule:", error);
		res.json([]);
	}
});

router.post("/work-schedule", async (req, res) => {
	try {
		const { user_id, work_date, working, start_time, end_time } = req.body;
		const result = await query(
			`INSERT INTO work_days (user_id, work_date, is_working, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, work_date)
       DO UPDATE SET is_working = $3, start_time = $4, end_time = $5
       RETURNING *`,
			[
				user_id || 1,
				work_date,
				working !== false,
				start_time || "09:00",
				end_time || "18:00",
			],
		);
		res.status(201).json({
			id: result.rows[0].id,
			user_id: result.rows[0].user_id,
			work_date: result.rows[0].work_date,
			working: result.rows[0].is_working !== false,
			start_time: result.rows[0].start_time,
			end_time: result.rows[0].end_time,
		});
	} catch (error) {
		console.error("Error saving work schedule:", error);
		res.status(500).json({ error: "Failed to save work schedule" });
	}
});

// ============ LOCATIONS ============
router.get("/locations", async (_req, res) => {
	try {
		const result = await query(
			"SELECT * FROM locations ORDER BY created_at DESC LIMIT 100",
		);
		res.json(
			result.rows.map((l) => ({
				id: l.id,
				user_id: l.user_id,
				latitude: l.latitude,
				longitude: l.longitude,
				accuracy: l.accuracy || null,
				created_at: l.created_at,
			})),
		);
	} catch (error) {
		res.json([]);
	}
});

router.post("/locations", async (req, res) => {
	try {
		const { user_id, latitude, longitude, accuracy } = req.body;
		const result = await query(
			`INSERT INTO locations (user_id, latitude, longitude, accuracy, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
			[user_id || 1, latitude, longitude, accuracy],
		);
		res.status(201).json({
			id: result.rows[0].id,
			user_id: result.rows[0].user_id,
			latitude: result.rows[0].latitude,
			longitude: result.rows[0].longitude,
			accuracy: result.rows[0].accuracy,
			created_at: result.rows[0].created_at,
		});
	} catch (error) {
		console.error("Error saving location:", error);
		res.status(500).json({ error: "Failed to save location" });
	}
});

export default router;
