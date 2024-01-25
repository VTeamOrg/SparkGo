use sparkgo;
/* VIEW build */
/* Run after ddl */



/* Drops */
drop view if exists v_renting_station;
drop view if exists v_vehicle;
drop view if exists v_receipt;
drop view if exists v_price_list;
drop view if exists v_plan;
drop view if exists v_member;
drop view if exists v_parking_zone;

/* Renting station + city */
CREATE VIEW v_renting_station AS
SELECT
    rs.*,
    c.name AS city_name
FROM
    renting_station AS rs
JOIN
    city AS c
ON
    rs.city_id = c.id;


CREATE VIEW v_parking_zone AS
SELECT
    pz.*,
    c.name AS city_name
FROM
    parking_zone AS pz
JOIN
    city AS c
ON
    pz.city_id = c.id;

/* Vehicle + city / member / vehicle_type */
CREATE VIEW v_vehicle AS
SELECT
    v.*,
    vt.name AS type_name,
    c.name AS city_name
FROM
    vehicle AS v
JOIN
    vehicle_type AS vt
ON
    v.type_id = vt.id
JOIN
    city AS c
ON
    v.city_id = c.id;

/* receipt + member */
CREATE VIEW v_receipt AS
SELECT
    r.*,
    m.name as member_name
FROM
    receipt r
JOIN
    member m ON r.member_id = m.id;

/* Price list, vehicle type */
CREATE VIEW v_price_list AS
SELECT
    r.*,
    t.name as type_name
FROM
    price_list r
JOIN
    vehicle_type t ON r.type_id = t.id;    

/* plan view */
CREATE VIEW v_plan AS 
SELECT 
    p.*,
    pf.name AS price_frequency_name,
    iuf.name AS included_unlocks_frequency_name,
    imf.name AS included_minutes_frequency_name
FROM 
    plan p
LEFT JOIN
    frequencies pf ON p.price_frequency_id = pf.id
LEFT JOIN
    frequencies iuf ON p.included_unlocks_frequency_id = iuf.id
LEFT JOIN
    frequencies imf ON p.included_minutes_frequency_id = imf.id;

/* Member view with plan addons */
CREATE VIEW v_member AS
SELECT
    m.*,
    pm.method_name AS payment_method,
    pm.reference_info AS payment_reference,
    pm.is_selected AS payment_selected,
    ap.plan_id AS active_plan_id,
    ap.creation_date AS active_plan_creation,
    ap.activation_date AS active_plan_activation,
    ap.available_minutes AS active_plan_minutes,
    ap.available_unlocks AS active_plan_unlocks,
    ap.is_paused AS active_plan_paused,
    p.title AS active_plan_name,
    p.price AS active_plan_price,
    p.price_frequency_id AS active_plan_frequency,
    f.name AS active_plan_frequency_name
FROM
    member m
LEFT JOIN
    payment_method pm ON m.id = pm.member_id
LEFT JOIN
    active_plan ap ON m.id = ap.member_id
LEFT JOIN
    plan p ON ap.plan_id = p.id
LEFT JOIN
frequencies f ON p.price_frequency_id = f.id;

-- CREATE VIEW v_vehicle AS
-- SELECT
--     v.*,
--     vt.name AS vehicle_type_name,
--     c.name AS city_name
-- FROM
--     vehicle v
-- LEFT JOIN
--     vehicle_type vt ON v.type_id = vt.id
-- LEFT JOIN
--     city c ON v.city_id = c.id;
