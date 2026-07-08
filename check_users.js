const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
}

check();
