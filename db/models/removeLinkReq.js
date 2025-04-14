import mongoose from "mongoose";

const RemoveLinkRequestSchema = new mongoose.Schema({
  
  email: {
    type:String,
    required: true,
    unique:false
  },
 
  requestDate: {
    type: Date,
    default: Date.now
  },
  url: {
    type:String,
    required: true,
    unique:false
  },
  
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected','no action'],
    default: 'no action'
  }
});


const RemoveLinkRequestModel = mongoose.model('removerequests', RemoveLinkRequestSchema);

export default RemoveLinkRequestModel;