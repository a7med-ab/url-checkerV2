import mongoose from "mongoose"

const connectionDB=async()=>{
   return await mongoose.connect("mongodb+srv://ahmedabdulaziz875:admin@cluster0.tq777ei.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0")
    //"mongodb+srv://ahmedabdulaziz1147ab:admin@cluster0.nz6ic.mongodb.net/virus_app?retryWrites=true&w=majority&appName=Cluster0") // /naMeOFdB
    
    .then(()=>{
        console.log("db connected")
    }).catch((err)=>{
        console.log("err",err)
    })
        
       
}


export default connectionDB 
