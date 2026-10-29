import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { adminAuthConfigured } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const metadata:Metadata = { title:"Admin sign in", robots:{index:false,follow:false} };

export default async function AdminLoginPage({searchParams}:{searchParams:Promise<{error?:string;return_to?:string}>}) {
  const user = await getChatGPTUser();
  if (user) redirect("/admin");
  const query = await searchParams;
  const configured = adminAuthConfigured();
  return <main className="admin-login-page"><section className="admin-login-card">
    <Link href="/" className="admin-login-brand"><img src="/assets/vesterra-mark.svg" alt=""/><span>Vesterra</span></Link>
    <div className="admin-login-kicker">Secure administration</div><h1>Welcome back.</h1><p>Sign in to manage properties, enquiries and website content.</p>
    {!configured?<div className="admin-login-warning">Admin login is not configured yet. Add <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> as encrypted Cloudflare Worker secrets.</div>:null}
    {query.error?<div className="admin-login-error">Incorrect password. Please try again.</div>:null}
    <form action="/api/admin/login" method="post"><input type="hidden" name="return_to" value={safeReturn(query.return_to)}/><label>Password<input name="password" type="password" autoComplete="current-password" required autoFocus/></label><button className="adm-btn primary" disabled={!configured}>Sign in</button></form>
    <Link className="admin-login-back" href="/">← Return to website</Link>
  </section></main>;
}

function safeReturn(value?:string) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/admin"; }
