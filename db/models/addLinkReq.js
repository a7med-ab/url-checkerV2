import mongoose from "mongoose";

const addLinkRequestSchema = new mongoose.Schema({
  
  email: {
    type:String,
    required: true
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


const AddLinkRequestModel = mongoose.model('addLinkrequests', addLinkRequestSchema);

export default AddLinkRequestModel;