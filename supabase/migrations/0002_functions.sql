-- Helper: rooms left for a given date range
create function public._rooms_left(p_room_type_id bigint, p_in date, p_out date, p_exclude bigint default null)
returns int language sql stable security definer set search_path = public as $$
  select greatest(0, rt.quantity - coalesce(max(occ.booked), 0))::int
  from room_types rt
  left join lateral (
    select d::date as night,
           coalesce(sum(b.units) filter (where b.id is distinct from p_exclude), 0) as booked
    from generate_series(p_in::timestamp, (p_out - 1)::timestamp, interval '1 day') d
    left join bookings b
      on b.room_type_id = rt.id and b.status = 'confirmed'
     and b.start_date <= d::date and b.end_date > d::date
    group by d
  ) occ on true
  where rt.id = p_room_type_id
  group by rt.quantity
$$;

-- Helper: compute stay quote
create function public._stay_quote(p_price_per_night numeric, p_nights int, p_rooms int)
returns table(subtotal numeric, taxes numeric, total numeric) language sql stable security definer set search_path = public as $$
  select
    round(p_price_per_night * p_nights * p_rooms, 2) as subtotal,
    round(round(p_price_per_night * p_nights * p_rooms, 2) * 0.12, 2) as taxes,
    round(p_price_per_night * p_nights * p_rooms, 2) + round(round(p_price_per_night * p_nights * p_rooms, 2) * 0.12, 2) as total
$$;

-- Helper: compute flight quote
create function public._flight_quote(p_price numeric, p_seats int)
returns table(subtotal numeric, taxes numeric, total numeric) language sql stable security definer set search_path = public as $$
  select
    round(p_price * p_seats, 2) as subtotal,
    round(round(p_price * p_seats, 2) * 0.10, 2) as taxes,
    round(p_price * p_seats, 2) + round(round(p_price * p_seats, 2) * 0.10, 2) as total
$$;

-- Helper: compute refund
create function public._compute_refund(p_booking_id bigint, out refund_amount numeric, out explanation text)
language plpgsql security definer set search_path = public as $$
declare
  v_booking bookings;
  v_policy text;
  v_policy_snapshot jsonb;
  v_first_night_total numeric;
  v_depart_at timestamptz;
begin
  select * into v_booking from bookings where id = p_booking_id;
  
  if v_booking is null then
    raise exception 'NOT_FOUND';
  end if;

  v_policy_snapshot := v_booking.policy_snapshot;
  
  if v_booking.type = 'stay' then
    v_policy := v_policy_snapshot->>'policy';
    v_first_night_total := (v_policy_snapshot->>'first_night_total')::numeric;
    
    if v_policy = 'free' then
      if v_booking.start_date > current_date then
        refund_amount := v_booking.total;
        explanation := 'Free cancellation: full refund';
      else
        refund_amount := greatest(0, v_booking.total - v_first_night_total);
        explanation := 'Free cancellation after check-in: refund minus first night';
      end if;
    elsif v_policy = 'partial' then
      if v_booking.start_date > current_date then
        refund_amount := round(v_booking.total * 0.5, 2);
        explanation := 'Partial refund: 50% of total';
      else
        refund_amount := 0;
        explanation := 'Partial refund: non-refundable after check-in';
      end if;
    elsif v_policy = 'non_refundable' then
      refund_amount := 0;
      explanation := 'Non-refundable booking';
    else
      refund_amount := 0;
      explanation := 'Unknown policy';
    end if;
  elsif v_booking.type = 'flight' then
    v_depart_at := (v_policy_snapshot->>'depart_at')::timestamptz;
    if (v_depart_at - now()) > interval '48 hours' then
      refund_amount := round(v_booking.total * 0.5, 2);
      explanation := 'Flight refund: 50% of total (more than 48 hours before departure)';
    else
      refund_amount := 0;
      explanation := 'Flight refund: 0% (less than 48 hours before departure)';
    end if;
  else
    refund_amount := 0;
    explanation := 'Unknown booking type';
  end if;
end $$;

-- stay_offers: list available rooms for a city and dates
create function public.stay_offers(p_city text default null, p_property_id bigint default null, p_check_in date, p_check_out date, p_rooms int default 1)
returns table(
  room_type_id bigint, property_id bigint, rooms_left int, nights int,
  price_per_night numeric, subtotal numeric, taxes numeric, total numeric
) language plpgsql stable security definer set search_path = public as $$
declare
  v_nights int;
begin
  -- Validate dates
  if p_check_out <= p_check_in or p_check_in < current_date or (p_check_out - p_check_in) > 30 then
    raise exception 'INVALID_DATES';
  end if;

  v_nights := p_check_out - p_check_in;

  return query
  select
    rt.id,
    rt.property_id,
    public._rooms_left(rt.id, p_check_in, p_check_out),
    v_nights,
    rt.price_per_night,
    sq.subtotal,
    sq.taxes,
    sq.total
  from room_types rt
  join properties p on rt.property_id = p.id
  cross join public._stay_quote(rt.price_per_night, v_nights, p_rooms) sq
  where
    (p_city is null or lower(p.city) = lower(p_city))
    and (p_property_id is null or p.id = p_property_id)
  order by rt.id;
end $$;

-- search_flights: list available flights
create function public.search_flights(p_origin text, p_dest text, p_from date, p_to date, p_passengers int default 1)
returns table(
  flight_id bigint, airline text, flight_no text, origin_city text, dest_city text,
  depart_at timestamptz, arrive_at timestamptz, duration_min int,
  seats_left int, price numeric, subtotal numeric, taxes numeric, total numeric
) language plpgsql stable security definer set search_path = public as $$
begin
  return query
  select
    f.id,
    f.airline,
    f.flight_no,
    f.origin_city,
    f.dest_city,
    f.depart_at,
    f.arrive_at,
    f.duration_min,
    f.seats_total - coalesce(sum(b.units) filter (where b.status = 'confirmed'), 0)::int as seats_left,
    f.price,
    fq.subtotal,
    fq.taxes,
    fq.total
  from flights f
  left join bookings b on b.flight_id = f.id
  cross join public._flight_quote(f.price, p_passengers) fq
  where
    lower(f.origin_city) = lower(p_origin)
    and lower(f.dest_city) = lower(p_dest)
    and f.depart_at::date between p_from and p_to
    and f.depart_at > now()
    and (f.seats_total - coalesce(sum(b.units) filter (where b.status = 'confirmed'), 0)::int) >= p_passengers
  group by f.id, fq.subtotal, fq.taxes, fq.total
  order by f.depart_at;
end $$;

-- quote_booking: get a quote for booking
create function public.quote_booking(p_type text, p_room_type_id bigint, p_flight_id bigint, p_check_in date, p_check_out date, p_units int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_result jsonb;
  v_rooms_left int;
  v_price_per_night numeric;
  v_nights int;
  v_offer record;
  v_flight record;
  v_seats_left int;
  v_cancellation_policy text;
  v_free_cancel_days int;
  v_deadline_date date;
begin
  if p_type = 'stay' then
    -- Get the offer
    select * into v_offer from public.stay_offers(null, null, p_check_in, p_check_out, 1)
    where room_type_id = p_room_type_id limit 1;
    
    if v_offer is null then
      raise exception 'NOT_FOUND';
    end if;

    v_rooms_left := v_offer.rooms_left;
    v_price_per_night := v_offer.price_per_night;
    v_nights := v_offer.nights;

    -- Get cancellation policy
    select cancellation_policy, free_cancel_days into v_cancellation_policy, v_free_cancel_days
    from room_types where id = p_room_type_id;

    v_deadline_date := p_check_in - (v_free_cancel_days || ' days')::interval;
    
    v_result := jsonb_build_object(
      'available', v_rooms_left >= p_units,
      'rooms_left', v_rooms_left,
      'nights', v_nights,
      'price_per_night', v_price_per_night,
      'subtotal', v_offer.subtotal,
      'taxes', v_offer.taxes,
      'total', v_offer.total,
      'cancellation_text', case
        when v_cancellation_policy = 'free' then 'Free cancellation until ' || to_char(v_deadline_date, 'DD Mon YYYY')
        when v_cancellation_policy = 'partial' then '50% refund until ' || to_char(v_deadline_date, 'DD Mon YYYY') || ', none after'
        when v_cancellation_policy = 'non_refundable' then 'Non-refundable'
        else ''
      end
    );
  elsif p_type = 'flight' then
    -- Get flight info
    select f.*, coalesce(f.seats_total - sum(b.units) filter (where b.status = 'confirmed'), f.seats_total)::int as seats_left
    into v_flight
    from flights f
    left join bookings b on b.flight_id = f.id
    where f.id = p_flight_id
    group by f.id;
    
    if v_flight is null then
      raise exception 'NOT_FOUND';
    end if;

    v_seats_left := v_flight.seats_left;

    with fq as (
      select * from public._flight_quote(v_flight.price, p_units)
    )
    select * into v_offer from fq;

    v_result := jsonb_build_object(
      'available', v_seats_left >= p_units,
      'seats_left', v_seats_left,
      'price', v_flight.price,
      'subtotal', v_offer.subtotal,
      'taxes', v_offer.taxes,
      'total', v_offer.total,
      'cancellation_text', '50% refund if cancelled more than 48h before departure'
    );
  else
    raise exception 'INVALID_INPUT';
  end if;

  return v_result;
end $$;

-- create_booking: atomic booking creation
create function public.create_booking(
  p_type text,
  p_room_type_id bigint,
  p_flight_id bigint,
  p_start date,
  p_end date,
  p_guests int,
  p_units int,
  p_lead_name text,
  p_lead_email text,
  p_card_last4 text,
  p_trip_id bigint default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_booking_id bigint;
  v_booking_code text;
  v_rt room_types;
  v_flight flights;
  v_quote jsonb;
  v_policy_snapshot jsonb;
  v_nights int;
  v_price_per_night numeric;
  v_first_night_total numeric;
  v_cancellation_policy text;
  v_free_cancel_days int;
  v_trip trips;
  v_charset text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  -- Auth check
  if auth.uid() is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  -- Lock and validate based on type
  if p_type = 'stay' then
    select * into v_rt from room_types where id = p_room_type_id for update;
    
    if v_rt is null then
      raise exception 'NOT_FOUND';
    end if;

    -- Validate dates
    if p_end <= p_start or p_start < current_date or (p_end - p_start) > 30 then
      raise exception 'INVALID_DATES';
    end if;

    -- Validate units
    if p_units < 1 or p_units > 5 then
      raise exception 'INVALID_INPUT';
    end if;

    -- Validate guests
    if p_guests > p_units * v_rt.max_guests then
      raise exception 'CAPACITY_EXCEEDED';
    end if;

    -- Check availability
    if public._rooms_left(p_room_type_id, p_start, p_end) < p_units then
      raise exception 'SOLD_OUT';
    end if;

    v_nights := p_end - p_start;
    v_price_per_night := v_rt.price_per_night;
    v_cancellation_policy := v_rt.cancellation_policy;
    v_free_cancel_days := v_rt.free_cancel_days;
    v_first_night_total := round(v_price_per_night * p_units * 1.12, 2);

    v_policy_snapshot := jsonb_build_object(
      'policy', v_cancellation_policy,
      'free_cancel_days', v_free_cancel_days,
      'deadline_date', (p_start - (v_free_cancel_days || ' days')::interval)::date,
      'price_per_night', v_price_per_night,
      'first_night_total', v_first_night_total
    );

  elsif p_type = 'flight' then
    select * into v_flight from flights where id = p_flight_id for update;
    
    if v_flight is null then
      raise exception 'NOT_FOUND';
    end if;

    -- Validate departure is in future
    if v_flight.depart_at <= now() then
      raise exception 'INVALID_DATES';
    end if;

    -- Check seats
    if (select coalesce(v_flight.seats_total - sum(b.units) filter (where b.status = 'confirmed'), v_flight.seats_total)
        from bookings b where b.flight_id = p_flight_id) < p_units then
      raise exception 'SOLD_OUT';
    end if;

    -- For flights, guests must equal units
    if p_guests != p_units then
      raise exception 'INVALID_INPUT';
    end if;

    v_policy_snapshot := jsonb_build_object(
      'policy', 'flight_standard',
      'depart_at', v_flight.depart_at::text
    );

  else
    raise exception 'INVALID_INPUT';
  end if;

  -- Validate trip if provided
  if p_trip_id is not null then
    select * into v_trip from trips where id = p_trip_id;
    if v_trip is null or v_trip.user_id != auth.uid() then
      raise exception 'FORBIDDEN';
    end if;
  end if;

  -- Get quote
  v_quote := public.quote_booking(p_type, p_room_type_id, p_flight_id, p_start, p_end, p_units);

  -- Generate unique code
  loop
    v_booking_code := 'WF-' || substring(v_charset, 1 + (random() * 36)::int, 1) ||
                               substring(v_charset, 1 + (random() * 36)::int, 1) ||
                               substring(v_charset, 1 + (random() * 36)::int, 1) ||
                               substring(v_charset, 1 + (random() * 36)::int, 1) ||
                               substring(v_charset, 1 + (random() * 36)::int, 1) ||
                               substring(v_charset, 1 + (random() * 36)::int, 1);
    exit when not exists(select 1 from bookings where code = v_booking_code);
  end loop;

  -- Insert booking
  insert into bookings (
    code, user_id, type, room_type_id, flight_id, trip_id,
    start_date, end_date, guests, units,
    subtotal, taxes, total, status, policy_snapshot,
    lead_guest_name, lead_guest_email, card_last4
  ) values (
    v_booking_code, auth.uid(), p_type, p_room_type_id, p_flight_id, p_trip_id,
    p_start, p_end, p_guests, p_units,
    (v_quote->>'subtotal')::numeric, (v_quote->>'taxes')::numeric, (v_quote->>'total')::numeric,
    'confirmed', v_policy_snapshot,
    p_lead_name, p_lead_email, p_card_last4
  ) returning id into v_booking_id;

  return (select row_to_json(b) from bookings b where id = v_booking_id);
end $$;

-- preview_cancellation
create function public.preview_cancellation(p_booking_id bigint)
returns table(refund_amount numeric, explanation text) language plpgsql stable security definer set search_path = public as $$
declare
  v_booking bookings;
begin
  select * into v_booking from bookings where id = p_booking_id;
  
  if v_booking is null then
    raise exception 'NOT_FOUND';
  end if;

  if v_booking.user_id != auth.uid() then
    raise exception 'FORBIDDEN';
  end if;

  return query select * from public._compute_refund(p_booking_id);
end $$;

-- cancel_booking
create function public.cancel_booking(p_booking_id bigint)
returns table(
  id bigint, code text, user_id uuid, type text, start_date date, end_date date,
  total numeric, refund_amount numeric, refund_explanation text
) language plpgsql security definer set search_path = public as $$
declare
  v_booking bookings;
  v_refund numeric;
  v_explanation text;
begin
  select * into v_booking from bookings where id = p_booking_id for update;
  
  if v_booking is null then
    raise exception 'NOT_FOUND';
  end if;

  if v_booking.user_id != auth.uid() then
    raise exception 'FORBIDDEN';
  end if;

  if v_booking.status = 'cancelled' then
    raise exception 'ALREADY_CANCELLED';
  end if;

  if v_booking.type = 'stay' and v_booking.start_date < current_date then
    raise exception 'ALREADY_STARTED';
  end if;

  select refund_amount, explanation into v_refund, v_explanation from public._compute_refund(p_booking_id);

  update bookings set
    status = 'cancelled',
    refund_amount = v_refund,
    cancelled_at = now()
  where id = p_booking_id;

  return query
  select v_booking.id, v_booking.code, v_booking.user_id, v_booking.type,
         v_booking.start_date, v_booking.end_date, v_booking.total,
         v_refund, v_explanation;
end $$;

-- modify_booking (Tier 2)
create function public.modify_booking(p_booking_id bigint, p_new_in date, p_new_out date)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_booking bookings;
  v_rt room_types;
  v_new_nights int;
  v_new_subtotal numeric;
  v_new_taxes numeric;
  v_new_total numeric;
  v_old_total numeric;
  v_difference numeric;
  v_price_per_night numeric;
  v_new_snapshot jsonb;
begin
  select * into v_booking from bookings where id = p_booking_id for update;
  
  if v_booking is null then
    raise exception 'NOT_FOUND';
  end if;

  if v_booking.user_id != auth.uid() then
    raise exception 'FORBIDDEN';
  end if;

  if v_booking.type != 'stay' or v_booking.status != 'confirmed' or v_booking.start_date < current_date then
    raise exception 'NOT_MODIFIABLE';
  end if;

  select * into v_rt from room_types where id = v_booking.room_type_id for update;

  -- Check availability for new dates, excluding this booking
  if public._rooms_left(v_booking.room_type_id, p_new_in, p_new_out, v_booking.id) < v_booking.units then
    raise exception 'SOLD_OUT';
  end if;

  v_new_nights := p_new_out - p_new_in;
  v_price_per_night := (v_booking.policy_snapshot->>'price_per_night')::numeric;
  v_new_subtotal := round(v_price_per_night * v_new_nights * v_booking.units, 2);
  v_new_taxes := round(v_new_subtotal * 0.12, 2);
  v_new_total := v_new_subtotal + v_new_taxes;
  v_old_total := v_booking.total;
  v_difference := v_new_total - v_old_total;

  v_new_snapshot := v_booking.policy_snapshot;
  v_new_snapshot := jsonb_set(v_new_snapshot, '{deadline_date}',
    to_jsonb(((p_new_in - ((v_booking.policy_snapshot->>'free_cancel_days')::int || ' days')::interval)::date)::text));

  update bookings set
    start_date = p_new_in,
    end_date = p_new_out,
    subtotal = v_new_subtotal,
    taxes = v_new_taxes,
    total = v_new_total,
    policy_snapshot = v_new_snapshot
  where id = p_booking_id;

  return jsonb_build_object(
    'old_total', v_old_total,
    'new_total', v_new_total,
    'difference', v_difference,
    'booking', (select row_to_json(b) from bookings b where id = p_booking_id)
  );
end $$;

-- submit_review (Tier 2)
create function public.submit_review(p_property_id bigint, p_score numeric, p_title text, p_body text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_profile profiles;
  v_review_id bigint;
begin
  if auth.uid() is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  -- Check if user has a non-cancelled booking at this property
  if not exists(
    select 1 from bookings b
    join room_types rt on b.room_type_id = rt.id
    where rt.property_id = p_property_id
    and b.user_id = auth.uid()
    and b.status = 'confirmed'
    and b.type = 'stay'
  ) then
    raise exception 'NOT_A_GUEST';
  end if;

  -- Check if user already reviewed this property
  if exists(select 1 from reviews where property_id = p_property_id and user_id = auth.uid()) then
    raise exception 'ALREADY_REVIEWED';
  end if;

  select * into v_profile from profiles where id = auth.uid();

  insert into reviews (property_id, user_id, author_name, score, title, body)
  values (p_property_id, auth.uid(), v_profile.name, p_score, p_title, p_body)
  returning id into v_review_id;

  return (select row_to_json(r) from reviews r where id = v_review_id);
end $$;

-- attach_booking_to_trip (Tier 3)
create function public.attach_booking_to_trip(p_booking_id bigint, p_trip_id bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_booking bookings;
  v_trip trips;
  v_property properties;
  v_flight flights;
begin
  if auth.uid() is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  select * into v_booking from bookings where id = p_booking_id for update;
  if v_booking is null then
    raise exception 'NOT_FOUND';
  end if;

  if v_booking.user_id != auth.uid() then
    raise exception 'FORBIDDEN';
  end if;

  select * into v_trip from trips where id = p_trip_id;
  if v_trip is null or v_trip.user_id != auth.uid() then
    raise exception 'FORBIDDEN';
  end if;

  -- Update booking to attach to trip
  update bookings set trip_id = p_trip_id where id = p_booking_id;

  -- Create itinerary items
  if v_booking.type = 'stay' then
    select * into v_property from properties
    join room_types on room_types.property_id = properties.id
    where room_types.id = v_booking.room_type_id;

    insert into trip_items (trip_id, day, kind, booking_id, title)
    values (p_trip_id, v_booking.start_date, 'booking', p_booking_id, 'Check in: ' || v_property.name);

    insert into trip_items (trip_id, day, kind, booking_id, title)
    values (p_trip_id, v_booking.end_date, 'booking', p_booking_id, 'Check out: ' || v_property.name);

  elsif v_booking.type = 'flight' then
    select * into v_flight from flights where id = v_booking.flight_id;

    insert into trip_items (trip_id, day, kind, booking_id, title)
    values (p_trip_id, v_booking.start_date, 'booking', p_booking_id,
            v_flight.airline || ' ' || v_flight.flight_no || ': ' || v_flight.origin_city || ' to ' || v_flight.dest_city);
  end if;

  return jsonb_build_object('success', true);
end $$;

-- Grant execute permissions
revoke all on function public._rooms_left(bigint, date, date, bigint) from public, anon, authenticated;
revoke all on function public._stay_quote(numeric, int, int) from public, anon, authenticated;
revoke all on function public._flight_quote(numeric, int) from public, anon, authenticated;
revoke all on function public._compute_refund(bigint) from public, anon, authenticated;

grant execute on function public.stay_offers(text, bigint, date, date, int) to anon, authenticated;
grant execute on function public.search_flights(text, text, date, date, int) to anon, authenticated;
grant execute on function public.quote_booking(text, bigint, bigint, date, date, int) to anon, authenticated;
grant execute on function public.create_booking(text, bigint, bigint, date, date, int, int, text, text, text, bigint) to authenticated;
grant execute on function public.preview_cancellation(bigint) to authenticated;
grant execute on function public.cancel_booking(bigint) to authenticated;
grant execute on function public.modify_booking(bigint, date, date) to authenticated;
grant execute on function public.submit_review(bigint, numeric, text, text) to authenticated;
grant execute on function public.attach_booking_to_trip(bigint, bigint) to authenticated;
