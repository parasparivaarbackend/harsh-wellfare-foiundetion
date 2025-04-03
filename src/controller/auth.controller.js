import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP } from "../helper/index.js";
import sendMailTemplate from "../utils/sendOTP.js";

const EmailToOTP = new Map();

const Register = asyncHandler(async (req, res) => {
  // console.log(req);

  const { fullName, userName, email, MobileNumber, password } = req.body;

  if (
    [fullName, userName, email, MobileNumber, password].some(
      item => item.trim() === ""
    )
  ) {
    return res.status(400).json(new ApiError(400, "all fields required", req));
  }
  try {
    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    // return res.status(400).json(new ApiError(400, "User already exist", req));
    // }
    const user = await User.create({
      fullName,
      userName,
      email,
      MobileNumber,
      password
    });

    if (!user) {
      return res.status(500).json(new ApiError(500, "User not created", req));
    }

    const newUser = user.toObject();
    // console.log(newUser);
    delete newUser.password;

    const { OTP, min, expire } = generateOTP();
    
    EmailToOTP.set(user.email, { OTP, expire });

    const templateDetails = {
      url: "SendEmailOTP.ejs",
      title: "Verify Your Account",
      userName: user.fullName,
      OTP: OTP,
      min
    };

    const sendMailUser = {
      email: user.email,
      otp: OTP,
      Sub: "Verify your account"
    };

    // console.log(sendMailUser);
    const isEmailSend = await sendMailTemplate(sendMailUser, templateDetails);

    if (!isEmailSend) {
      await sendMailTemplate(sendMailUser, templateDetails);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "user registered successfully", newUser));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", req, [error]));
  }
});

export { Register };
