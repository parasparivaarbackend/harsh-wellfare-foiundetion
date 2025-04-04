import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP } from "../helper/index.js";
import sendMailTemplate from "../utils/sendOTP.js";

const EmailToOTP = new Map();

const Register = asyncHandler(async (req, res) => {
  const { fullName, userName, email, MobileNumber, password } = req.body;

  if (
    [fullName, userName, email, MobileNumber, password].some(
      item => item.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiError(400, "All fields are required", req));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exists", req));
    }

    const { OTP, min, expire } = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 5 minutes from now

    const user = await User.create({
      fullName,
      userName,
      email,
      MobileNumber,
      password,
      OTP,
      otpExpiresAt
    });

    if (!user) {
      return res.status(500).json(new ApiError(500, "User not created", req));
    }

    const newUser = user.toObject();
    delete newUser.password;
    delete newUser.OTP;

    EmailToOTP.set(user.email, { OTP, expire });

    const templateDetails = {
      url: "SendEmailOTP.ejs",
      title: "Verify Your Account",
      userName: user.fullName,
      OTP,
      min
    };

    const sendMailUser = {
      email: user.email,
      otp: OTP,
      Sub: "Verify your account"
    };

    await sendMailTemplate(sendMailUser, templateDetails);

    return res
      .status(200)
      .json(new ApiResponse(200, "User registered successfully", newUser));
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", req, [error]));
  }
});

// OTP verify

const otpverify = asyncHandler(async (req, res) => {
  const { useremail, userOTP } = req.body;

  if (!useremail || !userOTP) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and OTP are required", req));
  }

  try {
    const user = await User.findOne({ email: useremail });

    if (!user) {
      return res.status(400).json(new ApiError(400, "User not found", req));
    }

    if (!user.OTP || user.OTP != userOTP) {
      return res.status(400).json(new ApiError(400, "Invalid OTP", req));
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json(new ApiError(400, "OTP has expired", req));
    }

    await User.updateOne(
      { email: useremail },
      { $unset: { OTP: "", otpExpiresAt: "" } }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verified successfully"));
  } catch (error) {
    console.error("OTP verification error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", req, [error.message]));
  }
});

export { Register, otpverify };
