// =======================================================
// PetroGuard
// File: index.js
// Version: 2.3.0
// =======================================================

require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =======================================================
// HOME
// =======================================================

app.get("/", (req, res) => {
  res.send("PetroGuard API is running!");
});

// =======================================================
// HEALTH CHECK
// =======================================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "PetroGuard API is healthy"
  });
});

// =======================================================
// LOGIN
// =======================================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (authError) {
      return res.status(401).json({
        success: false,
        message: authError.message
      });
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select(`
          full_name,
          station_id,
          roles(name)
        `)
        .eq("user_id", authData.user.id)
        .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found."
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: profile.full_name,
        role: profile.roles.name,
        station_id: profile.station_id
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// =======================================================
// STATIONS
// =======================================================

app.get("/stations", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .order("id");

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      stations: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// =======================================================
// SERVER
// =======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 PetroGuard API running on port ${PORT}`);
});
