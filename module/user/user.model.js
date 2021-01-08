import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "member",
  },
  activation_key: {
    type: String,
    required: false
  },
  is_active: {
    type: Boolean,
    default: false
  },
  profileId: {
    type: String,
    required: false
  },
  requestPostId: {
    type: String,
    required: false
  }
});

const userModel = mongoose.model("user", userSchema);
export { userModel };
