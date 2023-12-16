DELIMITER //

CREATE PROCEDURE generate_receipt(
    IN rent_id INT
)
BEGIN
	DECLARE vehicle_id INT;
    DECLARE start_time DATETIME;
    DECLARE end_time DATETIME;
    DECLARE total_time_minutes INT;
    DECLARE unlock_cost DECIMAL(10, 2);
    DECLARE cost_per_minute DECIMAL(10, 2);
    DECLARE total_cost DECIMAL(10, 2);
    DECLARE payment_type VARCHAR(255);

    -- Hämta information från hyrningen
    SELECT scooter_rented_scooter, rented_at, returned_at, price_per_unlock, price_per_minute
    INTO vehicle_id, start_time, end_time, unlock_cost, cost_per_minute
    FROM rent
    JOIN price_list ON rent.scooter_rented_scooter = price_list.type_id
    WHERE rent.id = rent_id;
    
	-- Hämta betalningsmetoden från payment_method baserat på method_name
    SELECT method_name INTO payment_type
    FROM payment_method
    WHERE member_id = (SELECT user_renting FROM rent WHERE id = rent_id)
    AND is_selected = 'Y';

    -- Beräkna total körningstid i minuter
    SET total_time_minutes = TIMESTAMPDIFF(MINUTE, start_time, end_time);

    -- Beräkna total kostnad
    SET total_cost = unlock_cost + (total_time_minutes * cost_per_minute);

    -- Infoga information i kvittotabellen
    INSERT INTO receipt (member_id, vehicle_id, payment_type, start_time, end_time, total_time_minutes, unlock_cost, cost_per_minute, total_cost)
    VALUES (
    (SELECT user_renting FROM rent WHERE id = rent_id),
    vehicle_id,
    payment_type, 
    start_time,
    end_time,
    total_time_minutes,
    unlock_cost,
    cost_per_minute,
    total_cost
    );

    -- Uppdatera aktivt abonnemang om det finns
   /* UPDATE active_plan
    SET available_minutes = GREATEST(available_minutes - total_time_minutes, 0)
    WHERE user_renting = (SELECT user_renting FROM rent WHERE id = rent_id)
    AND activation_date <= start_time AND (activation_date + INTERVAL 30 DAY) > start_time;*/
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS generate_receipt;
