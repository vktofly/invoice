CREATE OR REPLACE FUNCTION get_recurring_invoices_summary()
RETURNS TABLE(active_count BIGINT, next_due_date DATE, projected_monthly_revenue NUMERIC, projected_yearly_revenue NUMERIC) AS $$
BEGIN
  RETURN QUERY
    SELECT
      COUNT(*) as active_count,
      MIN(next_generation_date) as next_due_date,
      SUM(CASE WHEN frequency = 'monthly' THEN total ELSE 0 END) +
      SUM(CASE WHEN frequency = 'yearly' THEN total / 12 ELSE 0 END) as projected_monthly_revenue,
      SUM(CASE WHEN frequency = 'yearly' THEN total ELSE 0 END) +
      SUM(CASE WHEN frequency = 'monthly' THEN total * 12 ELSE 0 END) as projected_yearly_revenue
    FROM
      recurring_invoices
    WHERE
      status = 'active';
END;
$$ LANGUAGE plpgsql;