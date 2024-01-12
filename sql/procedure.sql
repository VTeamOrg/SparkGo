
DELIMITER //
DROP PROCEDURE IF EXISTS create_active_plan;
CREATE PROCEDURE create_active_plan(
    IN p_plan_id INT,
    IN p_member_id INT,
    IN p_stripe_subscription_id VARCHAR(255),
    IN p_activation_date DATETIME,
    OUT p_result_message VARCHAR(255)
)
BEGIN
    DECLARE v_available_minutes INT;
    DECLARE v_available_unlocks INT;

    -- Get available_minutes and available_unlocks from the plan table
    SELECT included_minutes, included_unlocks
    INTO v_available_minutes, v_available_unlocks
    FROM plan
    WHERE id = p_plan_id;

    -- Check if the plan with the specified plan_id exists
    IF (v_available_minutes IS NULL OR v_available_unlocks IS NULL) THEN
        SET p_result_message = 'Error: Plan not found.';
    ELSE
        -- Insert the new record into the active_plan table
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

        SET p_result_message = 'Success: Active plan created.';
    END IF;
END //

DELIMITER ;

call create_active_plan();