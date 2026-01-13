// app/admin/layout.tsx (Server Component)
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js'
import AdminLayoutClient from "@/Components/admin/AdminLayoutClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    // Handle unauthorized - will be caught by middleware
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress || 
                user.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return null;
  }

  const normalizedEmail = email.toLowerCase();
  let isAuthorized = false;

  try {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("email")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (!error && data) {
      isAuthorized = true;
    }
  } catch (error) {
    console.error("Database check failed:", error);
  }

  return (
    <AdminLayoutClient email={email} isAuthorized={isAuthorized}>
      {children}
    </AdminLayoutClient>
  );
}