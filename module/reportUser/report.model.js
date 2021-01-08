import mongoose from "mongoose";

const schema = mongoose.Schema;

const reportSchema = new schema({

  violation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    required: true
  },
  referenceNumber: {
    type: Number,
    required: true
  },
  reportUserId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true , 
    ref: 'user'
  }

})


const reportModel = mongoose.model("report", reportSchema);
export { reportModel };
