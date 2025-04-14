import mongoose from "mongoose";



const SectorSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true

    }

})

const SectorModel = mongoose.model("sectorsRequests"/*name of model(table)*/, SectorSchema)//name of the schema
export default SectorModel