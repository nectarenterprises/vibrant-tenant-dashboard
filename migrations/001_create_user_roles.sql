
-- Create a roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'standard', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check for roles
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID, 
  _role app_role
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get a user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(
  _user_id UUID
) RETURNS SETOF app_role AS $$
BEGIN
  RETURN QUERY
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update handle_new_user function to assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, 
    COALESCE(new.raw_user_meta_data->>'first_name', ''), 
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  
  -- Assign default 'standard' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'standard');
  
  RETURN new;
END;
$$;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  USING (has_role(auth.uid(), 'admin'));

-- Create an audit log table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can see all logs
CREATE POLICY "Admins can view all logs"
  ON public.activity_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Users can see their own actions
CREATE POLICY "Users can view their own actions"
  ON public.activity_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Function to add a log entry
CREATE OR REPLACE FUNCTION public.log_activity(
  _action TEXT,
  _entity_type TEXT,
  _entity_id UUID DEFAULT NULL,
  _details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id, action, entity_type, entity_id, details, ip_address
  ) VALUES (
    auth.uid(),
    _action,
    _entity_type,
    _entity_id,
    _details,
    inet_client_addr()::TEXT
  )
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
