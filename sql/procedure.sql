
DELIMITER //
DROP PROCEDURE IF EXISTS create_active_plan;
CREATE PROCEDURE create_active_plan(
    IN p_plan_id INT,
    IN p_member_id INT,
    IN p_stripe_subscription_id VARCHAR(255),
    IN p_activation_date DATETIME
)
BEGIN
    DECLARE v_available_minutes INT;
    DECLARE v_available_unlocks INT;
    DECLARE v_member_exist INT;

    -- Get available_minutes and available_unlocks from the plan table

    SELECT included_minutes, included_unlocks
    INTO v_available_minutes, v_available_unlocks
    FROM plan
    WHERE id = p_plan_id;
	select v_available_minutes, v_available_unlocks;

    -- Check if the plan with the specified plan_id exists
   -- IF (v_available_minutes IS NULL OR v_available_unlocks IS NULL) THEN
	-- SIGNAL SQLSTATE '45000'
     --   SET MESSAGE_TEXT = 'Plan not found';
    -- ELSE
        -- Insert the new record into the active_plan table
        
	
        
			DELETE FROM active_plan WHERE member_id = p_member_id;

        
        INSERT INTO active_plan (
            plan_id,
            member_id,
            stripe_subscription_id,
            activation_date,
            available_minutes,
            available_unlocks,
            is_paused
        )
        VALUES (
            p_plan_id,
            p_member_id,
            p_stripe_subscription_id,
            p_activation_date,
            v_available_minutes,
            v_available_unlocks,
            'N'
        );

       SELECT 'Success' AS result;
     -- END IF;
END //

DELIMITER ;

--
-- Payment receipt
--

DROP PROCEDURE IF EXISTS insert_receipt;
DELIMITER ;;
CREATE PROCEDURE insert_receipt
(
	IN p_member_id INT,
    IN p_payment_details VARCHAR(255),
    IN p_payment_type VARCHAR(255),
    IN p_receipt_details VARCHAR(255),
    IN p_sum DECIMAL(10, 2),
    IN p_payment_date DATETIME
)
BEGIN
    INSERT INTO receipt 
    (
        member_id,
        payment_details,
        payment_type,
        receipt_details,
        sum,
        payment_date
    )
    VALUES 
    (
        p_member_id,
        p_payment_details,
        p_payment_type,
        p_receipt_details,
        p_sum,
        p_payment_date
    );
END;
;;
DELIMITER ;




CALL insert_receipt(2, 'test2', 'card', 'subscription', 89, now());
call create_active_plan(1, 1, 'stripe', now());
SELECT * FROM plan;
SELECT * FROM member;
SELECT * FROM active_plan;
SELECT * FROM receipt;
