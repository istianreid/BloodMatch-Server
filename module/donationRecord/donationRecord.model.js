import mongoose from "mongoose";

const schema = mongoose.Schema;

const donationRecordSchema = new schema({

  profileId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: 'profile'
  },
  requestPostId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: 'requestPost'
  },
  donationRecordDate: {
    type: String,
    required: true
  },
  amountDonated: {
    type: Number,
    required: true
  },
  pledgedBloodAmount: {
    type: Number
  },
  requestSentDate: {
    type: String,
    required: true
  },
  confirmation: {
    type: Boolean
  },
  referenceNumber: {
    type: String,
    required: true
  }

});


const donationRecordModel = mongoose.model("donationRecord", donationRecordSchema);
export { donationRecordModel };
