-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- Create a secure schema for whistleblower reports
create schema if not exists whistleblower;

-- Enable Row Level Security
alter table if exists whistleblower.reports force row level security;

-- Create the reports table
create table if not exists whistleblower.reports (
    id text primary key,
    encrypted_content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    ip_hash text not null, -- Store hashed IP for rate limiting while maintaining anonymity
    metadata jsonb default '{}'::jsonb -- For any additional encrypted metadata
);

-- Create index for faster querying
create index if not exists reports_created_at_idx on whistleblower.reports(created_at);
create index if not exists reports_ip_hash_idx on whistleblower.reports(ip_hash);

-- Create a function to hash IP addresses
create or replace function whistleblower.hash_ip(ip text)
returns text
language plpgsql
security definer
as $$
begin
    return encode(digest(ip, 'sha256'), 'hex');
end;
$$;

-- Create policies for row level security

-- Allow anonymous insert with rate limiting
create policy "Allow anonymous insert with rate limiting"
    on whistleblower.reports
    for insert
    with check (
        -- Limit to 5 reports per IP per day
        (
            select count(*)
            from whistleblower.reports
            where ip_hash = whistleblower.hash_ip(auth.jwt() ->> 'x-real-ip')
            and created_at > now() - interval '24 hours'
        ) < 5
    );

-- Prevent updates to existing reports
create policy "Prevent updates"
    on whistleblower.reports
    for update
    using (false);

-- Prevent deletions of reports
create policy "Prevent deletions"
    on whistleblower.reports
    for delete
    using (false);

-- Only allow reading reports with service role
create policy "Only service role can read"
    on whistleblower.reports
    for select
    using (auth.role() = 'service_role');

-- Create a secure view for administrators
create or replace view whistleblower.admin_reports as
select
    id,
    encrypted_content,
    created_at,
    metadata
from
    whistleblower.reports;

-- Grant necessary permissions
grant usage on schema whistleblower to anon, authenticated;
grant insert on whistleblower.reports to anon, authenticated;
grant select on whistleblower.admin_reports to service_role; 