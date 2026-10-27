-- Optional enquiry subject line, captured by the contact form.
alter table public.leads
  add column if not exists subject text
  check (subject is null or char_length(subject) <= 150);
