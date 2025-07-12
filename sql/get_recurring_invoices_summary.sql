CREATE OR REPLACE FUNCTION get_recurring_invoices_summary()
RETURNS TABLE(active_count BIGINT, next_due_date DATE) AS $$
BEGIN
  RETURN QUERY
    SELECT
      COUNT(*) as active_count,
      MIN(next_generation_date) as next_due_date
    FROM
      recurring_invoices
    WHERE
      status = 'active';
END;
$$ LANGUAGE plpgsql;
