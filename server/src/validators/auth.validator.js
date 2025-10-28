// Validation logic for passwords
const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

// Error message for password validation
const passwordPolicyError = {
    message: "Password must be 6+ characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character (e.g., !@#$%^&*)."
};

module.exports = {
  validatePassword,
  passwordPolicyError
};