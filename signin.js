function handleSignIn(userData) {
  const user = {
    username: userData.username,
    user_id: `USR${Date.now()}${userData.phone.slice(-4)}`,
    email: userData.email,
    phone: userData.phone,
    user_id: userData.user_id,
    password: userData.password,
    logged_in: true,
};
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('museum_logged_in', 'true');
}