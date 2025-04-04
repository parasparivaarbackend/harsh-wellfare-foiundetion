import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,

      trim: true,
      lowercase: true
      // index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
      // index: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },

    MobileNumber: {
      type: Number
    },
    OTP: {
      type: Number,
      allowNull: true
    },
    otpExpiresAt: {
      type: Date
    },
    ProfileImage: {
      type: String
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
