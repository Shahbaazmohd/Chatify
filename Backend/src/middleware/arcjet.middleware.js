// Dummy Arcjet middleware interceptor to satisfy the tutorial's requirements
// without forcing the user to adopt Arcjet keys unless they configure it later.
export const arcjetProtection = (req, res, next) => {
  next();
};
