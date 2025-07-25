CREATE OR REPLACE FUNCTION get_top_customers()
RETURNS TABLE(customer_id UUID, name TEXT, email TEXT, company TEXT, phone TEXT, total_invoiced NUMERIC) AS $
BEGIN
  RETURN QUERY
    SELECT
      c.id as customer_id,
      c.name,
      c.email,
      c.company,
      c.phone,
      SUM(i.total) as total_invoiced
    FROM
      customers c
    JOIN
      invoices i ON c.id = i.customer_id
    WHERE
      i.status = 'paid'
    GROUP BY
      c.id, c.name, c.email, c.company, c.phone
    ORDER BY
      total_invoiced DESC
    LIMIT 5;
END;
$ LANGUAGE plpgsql;
