const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
    return;
  }

  const user = data.user;

  const { data: profile, error: roleError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError) {
    document.getElementById("msg").innerText = "Role fetch failed";
    return;
  }

  if (profile.role === "owner") {
    window.location.href = "owner.html";
  } else if (profile.role === "manager") {
    window.location.href = "manager.html";
  } else if (profile.role === "attendant") {
    window.location.href = "attendant.html";
  } else if (profile.role === "cashier") {
    window.location.href = "cashier.html";
  }
}
