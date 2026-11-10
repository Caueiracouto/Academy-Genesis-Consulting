/*
# Make is_admin() run with the caller's rights

1. Modified Functions
- `public.is_admin()` is switched from SECURITY DEFINER to SECURITY INVOKER.

2. Why
- A SECURITY DEFINER function runs with its owner's privileges and was callable by every signed-in user through the Data API. That is not needed here.
- The function only checks whether the caller's own profile has the admin role. The profiles table already has a policy letting each user read their own row, so the check works correctly when the function runs as the caller.

3. Security
- Signed-in users can still call the function, but it can only reveal their own admin status.
- Admin write access on course sessions is unchanged: the policies that call this function keep working.
*/

ALTER FUNCTION public.is_admin() SECURITY INVOKER;
