import mongoose from "mongoose";

const schema = mongoose.Schema;

const profileSchema = new schema({

  photo: {
    type: String,
    required: false
  },
  userAbout: {
    type: String,
    required: false
  },
  bloodType: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  lastTimeDonated: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true , 
    ref: 'user'
  }

});


const profileModel = mongoose.model("profile", profileSchema);
export { profileModel };
