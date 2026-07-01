-- Revoke EXECUTE on the SECURITY DEFINER event-trigger helper from all untrusted roles.
-- This function auto-enables RLS on newly created tables; it must only be invokable by the
-- event trigger / database owner, never via the REST API (/rest/v1/rpc/rls_auto_enable).

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
