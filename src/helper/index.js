const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const min = 5;
  const expire = Date.now() + 1000 * 60 * min;

  return { OTP, min, expire };
};

export { generateOTP };
