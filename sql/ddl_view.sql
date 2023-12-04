/* VIEW build */
/* Run after ddl */



/* Drops */
drop view if exists v_renting_station;
drop view if exists v_vehicle;
drop view if exists v_receipt;

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

SHOW CREATE VIEW v_renting_station;
SHOW CREATE VIEW v_vehicle;