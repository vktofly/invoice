CREATE OR REPLACE FUNCTION get_top_products()
RETURNS TABLE(product_id UUID, name TEXT, total_sold NUMERIC) AS $$
BEGIN
  RETURN QUERY
    SELECT
      p.id as product_id,
      p.name,
      SUM(ii.quantity) as total_sold
    FROM
      products p
    JOIN
      invoice_items ii ON p.id = ii.product_id
    GROUP BY
      p.id, p.name
    ORDER BY
      total_sold DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;
