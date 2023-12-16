/* VIEW build */
/* Run after ddl */



/* Drops */
drop view if exists v_renting_station;
drop view if exists v_vehicle;
drop view if exists v_receipt;
drop view if exists v_price_list;
drop view if exists v_plan;

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

/* Vehicle + city / member / vehicle_type */
CREATE VIEW v_vehicle AS
SELECT
    v.*,
    vt.name AS type_name,
    IFNULL(m.name, 'N/A') AS member_name,
    c.name AS city_name
FROM
    vehicle AS v
JOIN
    vehicle_type AS vt
ON
    v.type_id = vt.id
LEFT JOIN
    member AS m
ON
    v.rented_by = m.id
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

/* plan, temp view */
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


