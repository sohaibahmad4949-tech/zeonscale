# What's new

1. **Project videos** – project cards autoplay a silent looping preview while on screen; each project page has a full player (sound + controls). Five concept-demo clips live in `public/videos/`. In **Admin > Projects** you can upload an MP4 (or paste an MP4 / YouTube / Vimeo link) and an optional thumbnail.
2. **SEO & Analytics** – **Admin > SEO & Analytics**: visitor analytics (views, visitors, top pages, sources, devices, quote conversion), per-page title/description/noindex editor with Google preview, and an SEO audit with sitemap.xml / robots.txt download. Optional Google Analytics 4: add `VITE_GA_ID=G-XXXX` to `.env`.
3. **Services** – now in the admin menu (**Admin > Services**): add, edit, reorder, hide services, with an optional "what's included" checklist.

## One-time step
Open `supabase/schema.sql`, paste it in Supabase > SQL Editor and run it again (it is safe to re-run). It adds the video columns, storage bucket, `seo_pages`, `page_views` and `services.features`.

Then `npm install` and `npm run dev`.

## Update 2: notifications, demos in admin, reviews
- **Admin notifications:** red count badges on Messages, Quote requests and Testimonials, a bell icon with a dropdown, and a `(n)` count in the browser tab title. Refreshes every 20 seconds.
- **Demo projects in admin:** Admin > Projects shows a banner with an "Add to my projects" button that copies the 5 sample projects into the database so you can edit, hide or delete them.
- **Write a review:** visitors can submit a star rating and review from the "What clients say" section. Reviews are saved as *pending* and only appear on the website after you click **Approve** in Admin > Testimonials.
- Re-run `supabase/schema.sql` once more (adds rating, email, status columns and the review submit policy).
