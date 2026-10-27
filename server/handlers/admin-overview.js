/*
 * Dashboard data, computed from the live database on every request.
 * Nothing here is estimated or sampled.
 */
import { handler, send } from "../http.js";
import { requireAdmin } from "../auth.js";
import { query } from "../db.js";
import { leadStats } from "../leads.js";

const IST_TODAY = "(now() at time zone 'Asia/Kolkata')::date";

export async function overview() {
  const [stats, recent, trend, activity, posts, postCounts, packages] = await Promise.all([
    leadStats(),
    query(`select id, reference, created_at, name, company, service, status, retreat_package
             from public.leads order by created_at desc limit 6`),
    query(`select d::date::text as day, count(l.id)::int as n
             from generate_series(${IST_TODAY} - 29, ${IST_TODAY}, interval '1 day') d
             left join public.leads l on (l.created_at at time zone 'Asia/Kolkata')::date = d::date
            group by d order by d`),
    query(`select a.id, a.action, a.actor_email, a.details, a.created_at, a.lead_id, l.name as lead_name, l.reference as lead_reference
             from public.audit_log a left join public.leads l on l.id = a.lead_id
            where a.action in ('lead_created','lead_updated','note_added','blog_post_created','blog_post_published',
                               'blog_post_unpublished','blog_post_updated','blog_post_deleted')
            order by a.created_at desc limit 10`),
    query(`select id, slug, title, status, category, updated_at, published_at from public.blog_posts order by updated_at desc limit 5`),
    query(`select status, count(*)::int n from public.blog_posts group by status`),
    query(`select retreat_package as package, count(*)::int n from public.leads where retreat_package is not null group by retreat_package`),
  ]);
  const pc = Object.fromEntries(postCounts.rows.map((r) => [r.status, r.n]));
  return {
    stats: { ...stats, published_posts: pc.published || 0, draft_posts: pc.draft || 0 },
    recentLeads: recent.rows,
    trend: trend.rows,
    activity: activity.rows,
    recentPosts: posts.rows,
    packages: Object.fromEntries(packages.rows.map((r) => [r.package, r.n])),
  };
}

/* GET /api/v1/admin/overview */
export default handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, ...(await overview()) });
  },
});
