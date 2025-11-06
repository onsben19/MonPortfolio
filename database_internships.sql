-- Create internships table for Supabase
-- Run this in Supabase SQL editor

create table if not exists internships (
  id bigserial primary key,
  title text not null,
  enterprise text not null,
  start_date date,
  end_date date,
  description text,
  tasks jsonb, -- array of strings or objects describing tasks
  logo_url text,
  certificate_url text,
  project_id bigint, -- optional FK to projects.id
  project_link text, -- optional direct link to a project
  created_at timestamptz default now()
);

-- If you have a `projects` table, add FK constraint (optional)
alter table internships
  add constraint fk_internships_projects
    foreign key (project_id) references projects(id) on delete set null;

-- Example insert
insert into internships (title, enterprise, start_date, end_date, description, tasks, logo_url, certificate_url, project_link)
values (
  'Frontend Intern',
  'Acme Corp',
  '2024-06-01',
  '2024-09-30',
  'Helped build UI components for the marketing site and collaborated on accessibility improvements.',
  '["Implemented responsive landing page","Added unit tests","Improved Lighthouse score by 12%"]'::jsonb,
  'https://example.com/logos/acme.svg',
  'https://example.com/certs/acme-cert.pdf',
  null
);
