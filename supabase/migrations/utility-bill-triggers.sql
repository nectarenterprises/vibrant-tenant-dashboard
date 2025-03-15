
-- Create a function to check for anomalies when a new utility bill is inserted
CREATE OR REPLACE FUNCTION check_utility_bill_anomalies()
RETURNS TRIGGER AS $$
DECLARE
  previous_bill RECORD;
  anomaly_type TEXT;
  severity TEXT;
  description TEXT;
  percentage_change NUMERIC;
BEGIN
  -- Get the most recent previous bill for the same utility type and property
  SELECT * INTO previous_bill FROM utility_bills
  WHERE property_id = NEW.property_id
  AND utility_type = NEW.utility_type
  AND id != NEW.id
  ORDER BY bill_date DESC
  LIMIT 1;
  
  -- If there's a previous bill, check for anomalies
  IF FOUND THEN
    -- Check for cost increase
    IF NEW.total_amount > previous_bill.total_amount * 1.2 THEN
      anomaly_type := 'cost_increase';
      percentage_change := ((NEW.total_amount / previous_bill.total_amount) - 1) * 100;
      
      -- Determine severity based on percentage increase
      IF NEW.total_amount > previous_bill.total_amount * 1.5 THEN
        severity := 'high';
      ELSE
        severity := 'medium';
      END IF;
      
      description := 'Cost increased by ' || ROUND(percentage_change) || '% compared to previous bill';
      
      -- Insert the anomaly record
      INSERT INTO utility_bill_anomalies (
        utility_bill_id, 
        anomaly_type, 
        severity, 
        description,
        detected_at
      ) VALUES (
        NEW.id,
        anomaly_type,
        severity,
        description,
        NOW()
      );
    END IF;
    
    -- Check for usage increase if usage data is available
    IF NEW.usage_quantity IS NOT NULL AND previous_bill.usage_quantity IS NOT NULL 
       AND NEW.usage_quantity > previous_bill.usage_quantity * 1.3 THEN
      anomaly_type := 'usage_increase';
      percentage_change := ((NEW.usage_quantity / previous_bill.usage_quantity) - 1) * 100;
      
      -- Determine severity based on percentage increase
      IF NEW.usage_quantity > previous_bill.usage_quantity * 1.8 THEN
        severity := 'high';
      ELSE
        severity := 'medium';
      END IF;
      
      description := 'Usage increased by ' || ROUND(percentage_change) || '% compared to previous bill';
      
      -- Insert the anomaly record
      INSERT INTO utility_bill_anomalies (
        utility_bill_id, 
        anomaly_type, 
        severity, 
        description,
        detected_at
      ) VALUES (
        NEW.id,
        anomaly_type,
        severity,
        description,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to check for anomalies after a utility bill is inserted
CREATE TRIGGER trigger_check_utility_bill_anomalies
AFTER INSERT ON utility_bills
FOR EACH ROW
EXECUTE FUNCTION check_utility_bill_anomalies();
