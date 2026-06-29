import express from "express";
import { query } from "../db/db.js";

const router = express.Router();

// Get all calls
router.get("/", async (req, res) => {
	try {
		const { status, object_id } = req.query;
		let sql = "SELECT * FROM calls";
		const params = [];
		const conditions = [];

		if (status) {
			params.push(status);
			conditions.push(`status = $${params.length}`);
		}
		if (object_id) {
			params.push(object_id);
			conditions.push(`object_id = $${params.length}`);
		}

		if (conditions.length > 0) {
			sql += " WHERE " + conditions.join(" AND ");
		}
		sql += " ORDER BY created_at DESC";

		const result = await query(sql, params);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching calls:", error);
		res.status(500).json({ error: "Failed to fetch calls" });
	}
});

// Get single call
router.get("/:id", async (req, res) => {
	try {
		const result = await query("SELECT * FROM calls WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Call not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching call:", error);
		res.status(500).json({ error: "Failed to fetch call" });
	}
});

// Create call
router.post("/", async (req, res) => {
	try {
		const {
			deadline,
			execution_date,
			engineer,
			assistant,
			status,
			type,
			object_id,
			object_name,
			short_address,
			tenant,
			system,
			request,
			our_tool,
			to_purchase,
			to_repair,
			activation,
			data_owner,
			customer_contact,
			creator,
		} = req.body;

		const result = await query(
			`INSERT INTO calls (deadline, execution_date, engineer, assistant, status, type,
        object_id, object_name, short_address, tenant, system, request, our_tool,
        to_purchase, to_repair, activation, data_owner, customer_contact, creator)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING *`,
			[
				deadline,
				execution_date,
				engineer,
				assistant,
				status || "new",
				type,
				object_id,
				object_name,
				short_address,
				tenant,
				system,
				request,
				our_tool,
				to_purchase,
				to_repair,
				activation,
				data_owner,
				customer_contact,
				creator,
			],
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating call:", error);
		res.status(500).json({ error: "Failed to create call" });
	}
});

// Update call
router.put("/:id", async (req, res) => {
	try {
		const {
			deadline,
			execution_date,
			engineer,
			assistant,
			status,
			type,
			object_id,
			object_name,
			short_address,
			tenant,
			system,
			request,
			our_tool,
			to_purchase,
			to_repair,
			activation,
			data_owner,
			customer_contact,
			creator,
		} = req.body;

		const result = await query(
			`UPDATE calls SET 
        deadline = $1, execution_date = $2, engineer = $3, assistant = $4,
        status = $5, type = $6, object_id = $7, object_name = $8, short_address = $9,
        tenant = $10, system = $11, request = $12, our_tool = $13, to_purchase = $14,
        to_repair = $15, activation = $16, data_owner = $17, customer_contact = $18,
        creator = $19, updated_at = CURRENT_TIMESTAMP
       WHERE id = $20 RETURNING *`,
			[
				deadline,
				execution_date,
				engineer,
				assistant,
				status,
				type,
				object_id,
				object_name,
				short_address,
				tenant,
				system,
				request,
				our_tool,
				to_purchase,
				to_repair,
				activation,
				data_owner,
				customer_contact,
				creator,
				req.params.id,
			],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Call not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating call:", error);
		res.status(500).json({ error: "Failed to update call" });
	}
});

// Delete call
router.delete("/:id", async (req, res) => {
	try {
		const result = await query("DELETE FROM calls WHERE id = $1 RETURNING id", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Call not found" });
		}
		res.json({ message: "Call deleted successfully" });
	} catch (error) {
		console.error("Error deleting call:", error);
		res.status(500).json({ error: "Failed to delete call" });
	}
});

export default router;
