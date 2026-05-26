const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

const Ticket = require('./models/Ticket');

const app = express();

app.use(cors());
app.use(express.json());



// =============================
// SLA TIME TARGETS (IN MINUTES)
// =============================


const slaTargets = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};



// =============================
// HELPER FUNCTION
// =============================

const enrichTicket = (ticket) => {
  const now = new Date();

  const endTime =
    ticket.status === "resolved" && ticket.resolvedAt
      ? ticket.resolvedAt
      : now;

  const ageMinutes = Math.floor(
    (new Date(endTime) - new Date(ticket.createdAt)) / (1000 * 60)
  );

  const target = slaTargets[ticket.priority];

  let slaBreached = false;

  if (ageMinutes > target) {
    slaBreached = true;
  }

  return {
    ...ticket.toObject(),
    ageMinutes,
    slaBreached,
  };
};



// =============================
// VALID STATUS TRANSITIONS
// =============================

const validTransitions = {
  open: ["in_progress"],
  in_progress: ["open", "resolved"],
  resolved: ["in_progress", "closed"],
  closed: ["resolved"],
};



// =============================
// CREATE TICKET
// =============================

app.post(
  "/tickets",
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("customerEmail")
      .isEmail()
      .withMessage("Valid customer email is required"),
    body("priority")
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { subject, description, customerEmail, priority } = req.body;

      const ticket = await Ticket.create({
        subject,
        description,
        customerEmail,
        priority,
      });

      const enrichedTicket = enrichTicket(ticket);

      res.status(201).json({
        success: true,
        data: enrichedTicket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);



// =============================
// GET ALL TICKETS
// =============================

app.get("/tickets", async (req, res) => {
  try {
    const { status, priority, breached } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    let enrichedTickets = tickets.map((ticket) => enrichTicket(ticket));

    // breached=true filter
    if (breached === "true") {
      enrichedTickets = enrichedTickets.filter(
        (ticket) => ticket.slaBreached === true
      );
    }

    res.status(200).json({
      success: true,
      count: enrichedTickets.length,
      data: enrichedTickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// =============================
// UPDATE TICKET STATUS
// =============================

app.patch(
  "/tickets/:id",
  [
    body("status")
      .isIn(["open", "in_progress", "resolved", "closed"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      const newStatus = req.body.status;
      const currentStatus = ticket.status;

      // SAME STATUS
      if (newStatus === currentStatus) {
        return res.status(400).json({
          success: false,
          message: "Ticket already has this status",
        });
      }

      // VALIDATE TRANSITION
      const allowedTransitions = validTransitions[currentStatus];

      if (!allowedTransitions.includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        });
      }

      // HANDLE resolvedAt
      if (newStatus === "resolved") {
        ticket.resolvedAt = new Date();
      }

      if (currentStatus === "resolved" && newStatus === "in_progress") {
        ticket.resolvedAt = null;
      }

      ticket.status = newStatus;

      await ticket.save();

      const enrichedTicket = enrichTicket(ticket);

      res.status(200).json({
        success: true,
        data: enrichedTicket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);



// =============================
// DELETE TICKET
// =============================

app.delete("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// =============================
// GET STATS
// =============================

app.get("/tickets/stats", async (req, res) => {
  try {
    const tickets = await Ticket.find();

    const stats = {
      statusCounts: {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      },

      priorityCounts: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
      },

      breachedOpenTickets: 0,
    };

    tickets.forEach((ticket) => {
      stats.statusCounts[ticket.status]++;

      stats.priorityCounts[ticket.priority]++;

      const enriched = enrichTicket(ticket);

      if (
        enriched.slaBreached &&
        ticket.status !== "resolved" &&
        ticket.status !== "closed"
      ) {
        stats.breachedOpenTickets++;
      }
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// =============================
// INVALID ROUTE HANDLER
// =============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



module.exports = app;