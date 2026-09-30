create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- auto-create profile on sign-up (name from signUp options.data.name)
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.properties (
  id bigint generated always as identity primary key,
  name text not null,
  city text not null,
  country text not null,
  type text not null check (type in ('hotel','apartment','resort','guesthouse')),
  stars int not null check (stars between 1 and 5),
  address text not null,
  description text not null,
  amenities text[] not null default '{}',
  distance_center_km numeric(4,1) not null,
  hue int not null check (hue between 0 and 360)
);
create index on public.properties (lower(city));

create table public.room_types (
  id bigint generated always as identity primary key,
  property_id bigint not null references public.properties(id) on delete cascade,
  name text not null,
  bed_config text not null,
  max_guests int not null,
  quantity int not null check (quantity > 0),
  price_per_night numeric(10,2) not null,
  meal_plan text not null check (meal_plan in ('room_only','breakfast','half_board')),
  cancellation_policy text not null check (cancellation_policy in ('free','partial','non_refundable')),
  free_cancel_days int not null default 2
);
create index on public.room_types (property_id);

create table public.reviews (
  id bigint generated always as identity primary key,
  property_id bigint not null references public.properties(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  score numeric(3,1) not null check (score between 1 and 10),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index on public.reviews (property_id);
create unique index on public.reviews (property_id, user_id) where user_id is not null;

create view public.property_ratings with (security_invoker = on) as
  select property_id, round(avg(score),1) as avg_score, count(*)::int as review_count
  from public.reviews group by property_id;

create table public.wishlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id bigint not null references public.properties(id) on delete cascade,
  primary key (user_id, property_id)
);

create table public.flights (
  id bigint generated always as identity primary key,
  airline text not null,
  flight_no text not null,
  origin_city text not null, origin_code text not null,
  dest_city text not null,   dest_code text not null,
  depart_at timestamptz not null,
  arrive_at timestamptz not null,
  duration_min int not null,
  price numeric(10,2) not null,
  seats_total int not null check (seats_total > 0)
);
create index on public.flights (origin_city, dest_city, depart_at);

create table public.activities (
  id bigint generated always as identity primary key,
  city text not null,
  name text not null,
  category text not null check (category in ('culture','food','nature','adventure','relax')),
  duration_h numeric(3,1) not null,
  price numeric(10,2) not null,
  description text not null
);
create index on public.activities (lower(city));

create table public.trips (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  travelers int not null default 1,
  budget numeric(10,2),
  created_at timestamptz not null default now()
);

create table public.bookings (
  id bigint generated always as identity primary key,
  code text not null unique,
  user_id uuid not null references auth.users(id),
  type text not null check (type in ('stay','flight')),
  room_type_id bigint references public.room_types(id),
  flight_id bigint references public.flights(id),
  trip_id bigint references public.trips(id) on delete set null,
  start_date date not null,
  end_date date not null,
  guests int not null,
  units int not null,
  subtotal numeric(10,2) not null,
  taxes numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null check (status in ('confirmed','cancelled')),
  refund_amount numeric(10,2) not null default 0,
  policy_snapshot jsonb not null,
  lead_guest_name text not null,
  lead_guest_email text not null,
  card_last4 text not null,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz,
  check ((type = 'stay' and room_type_id is not null and flight_id is null)
      or (type = 'flight' and flight_id is not null and room_type_id is null))
);
create index on public.bookings (room_type_id, status);
create index on public.bookings (flight_id, status);
create index on public.bookings (user_id, start_date);

create table public.trip_items (
  id bigint generated always as identity primary key,
  trip_id bigint not null references public.trips(id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('booking','activity','note')),
  booking_id bigint references public.bookings(id) on delete cascade,
  activity_id bigint references public.activities(id),
  title text not null,
  note text,
  sort int not null default 0
);
create index on public.trip_items (trip_id, day);
