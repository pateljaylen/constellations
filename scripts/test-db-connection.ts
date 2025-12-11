// Test script to verify database connection and schema
// Run with: npm run test:db

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing environment variables:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("🔍 Testing database connection...\n");

  // Test 1: Check if tables exist
  console.log("1. Checking tables...");
  
  // Test each table with appropriate query
  const { data: profiles, error: profilesErr } = await supabase.from("profiles").select("id").limit(1);
  console.log(profilesErr ? `   ❌ profiles: ${profilesErr.message}` : `   ✅ profiles: accessible`);
  
  const { data: groups, error: groupsErr } = await supabase.from("groups").select("id").limit(1);
  console.log(groupsErr ? `   ❌ groups: ${groupsErr.message}` : `   ✅ groups: accessible`);
  
  // group_members has composite key, not id
  const { data: members, error: membersErr } = await supabase.from("group_members").select("group_id, user_id").limit(1);
  console.log(membersErr ? `   ❌ group_members: ${membersErr.message}` : `   ✅ group_members: accessible`);
  
  const { data: reflections, error: reflectionsErr } = await supabase.from("reflections").select("id").limit(1);
  console.log(reflectionsErr ? `   ❌ reflections: ${reflectionsErr.message}` : `   ✅ reflections: accessible`);
  
  const { data: cadence, error: cadenceErr } = await supabase.from("cadence_assignments").select("id").limit(1);
  console.log(cadenceErr ? `   ❌ cadence_assignments: ${cadenceErr.message}` : `   ✅ cadence_assignments: accessible`);

  // Test 2: Check reflections columns
  console.log("\n2. Checking reflections columns...");
  const { data: reflection, error: refError } = await supabase
    .from("reflections")
    .select("id, content, sentiment, question_ids, assigned_week, assigned_month")
    .limit(1);

  if (refError) {
    console.error(`   ❌ Error checking columns: ${refError.message}`);
  } else {
    console.log("   ✅ All reflection columns accessible");
  }

  // Test 3: Check groups invite_token
  console.log("\n3. Checking groups invite_token...");
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id, name, invite_token")
    .limit(1);

  if (groupError) {
    console.error(`   ❌ Error checking invite_token: ${groupError.message}`);
  } else {
    console.log("   ✅ Groups invite_token accessible");
  }

  // Test 4: Check cadence_assignments structure
  console.log("\n4. Checking cadence_assignments...");
  const { data: cadenceData, error: cadenceError } = await supabase
    .from("cadence_assignments")
    .select("id, group_id, user_id, assigned_week, question_ids")
    .limit(1);

  if (cadenceError) {
    console.error(`   ❌ Error checking cadence_assignments: ${cadenceError.message}`);
    console.error("   💡 Make sure you've run schema-migrations.sql");
  } else {
    console.log("   ✅ cadence_assignments accessible");
  }

  console.log("\n✅ Database connection test complete!");
}

testConnection().catch(console.error);

