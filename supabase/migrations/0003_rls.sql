-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.room_types enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.flights enable row level security;
alter table public.activities enable row level security;
alter table public.trips enable row level security;
alter table public.bookings enable row level security;
alter table public.trip_items enable row level security;

-- Profiles: select/update own row only
create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Properties: anyone can read
create policy "Anyone can read properties"
on public.properties for select
using (true);

-- Room types: anyone can read
create policy "Anyone can read room types"
on public.room_types for select
using (true);

-- Reviews: anyone can read
create policy "Anyone can read reviews"
on public.reviews for select
using (true);

-- Property ratings view: anyone can read
create policy "Anyone can read property ratings"
on public.property_ratings for select
using (true);

-- Wishlist: users can read/insert/delete their own
create policy "Users can view their own wishlist"
on public.wishlist for select
using (auth.uid() = user_id);

create policy "Users can add to their own wishlist"
on public.wishlist for insert
with check (auth.uid() = user_id);

create policy "Users can remove from their own wishlist"
on public.wishlist for delete
using (auth.uid() = user_id);

-- Flights: anyone can read
create policy "Anyone can read flights"
on public.flights for select
using (true);

-- Activities: anyone can read
create policy "Anyone can read activities"
on public.activities for select
using (true);

-- Bookings: users can read their own only, no direct insert/update (RPC only)
create policy "Users can read their own bookings"
on public.bookings for select
using (auth.uid() = user_id);

-- Trips: users can do full CRUD on their own trips
create policy "Users can read their own trips"
on public.trips for select
using (auth.uid() = user_id);

create policy "Users can insert their own trips"
on public.trips for insert
with check (auth.uid() = user_id);

create policy "Users can update their own trips"
on public.trips for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own trips"
on public.trips for delete
using (auth.uid() = user_id);

-- Trip items: users can do full CRUD if trip belongs to them
create policy "Users can read trip items of their trips"
on public.trip_items for select
using (
  exists (
    select 1 from trips t where t.id = trip_id and t.user_id = auth.uid()
  )
);

create policy "Users can insert trip items to their trips"
on public.trip_items for insert
with check (
  exists (
    select 1 from trips t where t.id = trip_id and t.user_id = auth.uid()
  )
);

create policy "Users can update trip items of their trips"
on public.trip_items for update
using (
  exists (
    select 1 from trips t where t.id = trip_id and t.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from trips t where t.id = trip_id and t.user_id = auth.uid()
  )
);

create policy "Users can delete trip items from their trips"
on public.trip_items for delete
using (
  exists (
    select 1 from trips t where t.id = trip_id and t.user_id = auth.uid()
  )
);
