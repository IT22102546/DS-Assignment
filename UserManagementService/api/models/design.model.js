import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    shopId: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    cakeType: {
      type: String,
    
    },
    cakeShape: {
      type: String,
      
    },
    cakeSize: {
      type: String,
   
    },
    veganOption: {
      type: String,
      
    },
    addons: [String],
    isReject: {
      type: Boolean,
      default: false, 
    },
    isAccept: {
      type: Boolean,
      default: false, 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  
    isImageDesign: {
      type: Boolean,
      default: false
    },
    designImage: String,
    baseColor: String,
    flavor: String,
    cakeMessage: String,
    additionalDetails: String
  },
  {
    timestamps: true, 
  }
);

const Design = mongoose.model('Design', designSchema);

export default Design;
