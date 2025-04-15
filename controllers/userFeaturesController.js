import userModel from "../db/models/users.js";
import LinksModel from "../db/models/links.js"
import ApprovalRequestModel from "../db/models/approvalRequests.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { promisify } from 'node:util';
import appError from "../utilities/appError.js";
import { handleAsync } from "../utilities/handlingAsync.js";
import nodemailer from "nodemailer";
import AddLinkRequestModel from "../db/models/addLinkReq.js";
import RemoveLinkRequestModel from "../db/models/removeLinkReq.js";
import ModifyLinkRequestModel from "../db/models/modfyLinkReq.js";
import SectorModel from "../db/models/sectorRequests.js";

const verifyToken = promisify(jwt.verify).bind(jwt);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '202102703@pua.edu.eg',
        pass: 'pwmj sdjy zdtq xgof'
    }
});


export const checkLink = handleAsync(async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        const { url } = req.body;

        if (!bearerHeader) {
            return res.send({ msg: 'No token provided' }); // for front end when this appear return the user to the api of login to generate a new token
        }

        const bearer = bearerHeader.trim().split(' ');
        const token = bearer[1];

        const decoded = await verifyToken(token, 'a7med');

        const linkData = await LinksModel.findOne({ url });
        if (!linkData) {
            return next(new appError("Unknown URL", 404));
        }

       

        // Prepare email options
        let mailOptions = {
            from: 'تطبيق فحص الروابط',
            to: decoded.email,
            subject: 'نتيجة الفحص',
            html: `
                <h1>نتيجة الفحص</h1>
                <h2>تفاصيل الفحص:</h2>
                <ul>
                    <li>الفئة: ${linkData.category}</li>
                    <li>عدد الأشخاص الذين قالوا إنه صحيح: ${linkData.number_of_trueVotes}</li>
                    <li>عدد الأشخاص الذين قالوا إنه خطأ: ${linkData.number_of_wrongVotes}</li>
                    <li>تاريخ الإرسال الأول: ${linkData.date_of_firstSubmession}</li>
                </ul>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.send({
            msg: 'The provided URL is:',url,
            category: linkData.category,
            number_of_people_say_its_true: linkData.number_of_trueVotes,
            number_of_people_say_its_false: linkData.number_of_wrongVotes,
            submession_date: linkData.date_of_firstSubmession
        });

    } catch (err) {
        return next(new appError("Internal server error", err));
    }
});


export const reportResult =handleAsync ( async (req, res) => { //users report a result
    try {
        const bearerHeader = req.headers['authorization'];
        const { url } = req.params;
        const{status}=req.params;

        if (!bearerHeader) {
            return next(new appError("no token please sign in again",404))//for front end when this appear return the user to the api of login to generate a new token
        }


        const linkData = await LinksModel.findOne({url})
        if (!linkData) { return res.send({ msg: 'unkown' }); }
        
            if(status==="true"){
                 linkData.number_of_trueVotes+=1
                await linkData.save(); 
                return res.send({ msg: 'your submession completed' });
            }
            else if (status==="false"){
                linkData.number_of_wrongVotes+=1 
               await linkData.save();
                return res.send({ msg: 'your submession completed' });
            }
            return res.send({ msg: 'done' });

        
         

    } catch (err) {
        return next(new appError("err",500))
    }
})
//--------------------------------------------------------
export const createApprovalRequest = handleAsync (async (req, res) => { 
    try { 
        const { email } = req.body; 
        
        // Find the user by email 
        const user = await userModel.findOne({ email }); 
        if (!user) { 
            return next(new appError("user not found",404))
        } 
        
         
        const approvalRequest = await ApprovalRequestModel.create({ email });
        await ApprovalRequestModel.findOneAndUpdate({ email }, { $set: { approvalStatus: "pending" } }, { new: true })
        
        // Save the approval request 
      
        
        return res.status(201).json({ msg: 'Approval request created successfully', approvalRequest }); 
    } catch (error) { 
        console.error('Error caught:', error); // Log the error for debugging 
        return res.status(500).json({ msg: 'Internal server error', error: error.message }); 
    } 
})
//------------------------------------------
export const RequestaddLink = handleAsync (async (req, res,next) => { //user
    const number_of_trueVotes=0
    const number_of_wrongVotes=0
    try {
        const bearerHeader = req.headers['authorization'];
        const { url,category } = req.body;

        if (!bearerHeader) {
            return res.send({ msg: 'No token provided' });
        }

        const bearer = bearerHeader.trim().split(' ');
        const token = bearer[1];
        
        const decoded = await verifyToken(token, 'a7med');
        const email = decoded.email;

        if (decoded.role !== "sector" && decoded.is_Sector !== false) {
            return next(new appError("unauthorized user",403))
        }

        await AddLinkRequestModel.create({email,url,category})
        return res.send({ msg: 'url added succesfully waiting for admin approve :',category });
       

    } catch (err) {
        return next(new appError("error unavailable url try again",err))
    }
})

//----------------------------------------------------------------

export const RequestremoveLink = handleAsync (async (req, res,next) => { //user
    const number_of_trueVotes=0
    const number_of_wrongVotes=0
    try {
        const bearerHeader = req.headers['authorization'];
        const { url } = req.body;

        if (!bearerHeader) {
            return res.send({ msg: 'No token provided' });
        }

        const bearer = bearerHeader.trim().split(' ');
        const token = bearer[1];

        const decoded = await verifyToken(token, 'a7med');

        if (decoded.role !== "sector"&& decoded.is_Sector !== false) {
            return next(new appError("unauthorized user",403))
        }

        await RemoveLinkRequestModel.deleteOne({url})
        return res.send({ msg: 'url requested to be deleted succesfully ' });
        //logic here 

    } catch (err) {
        return next(new appError("error unavailable url try again",404),err.message)
    }
})
//-----------------------------------
export const RequestModifyLink = handleAsync (async (req, res,next) => { //user
   
    try {
        const bearerHeader = req.headers['authorization'];
        const { url } = req.body;

        if (!bearerHeader) {
            return res.send({ msg: 'No token provided' });
        }

        const bearer = bearerHeader.trim().split(' ');
        const token = bearer[1];

        const decoded = await verifyToken(token, 'a7med');

        if (decoded.role !== "sector"&& decoded.is_Sector !== false) {
            return next(new appError("unauthorized user",403))
        }

        await ModifyLinkRequestModel.updateOne({url})
        return res.send({ msg: 'url requested for modifying succesfully ' });
        //logic here 

    } catch (err) {
        return next(new appError("error unavailable url try again",404),err.message)
    }
})

//--------------------------------------
export const RequestToBeSector = handleAsync(async (req, res, next) => {
    try {
        // 1. Check and verify the JWT token
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            return res.status(401).send({ msg: 'No token provided' });
        }

        const token = bearerHeader.split(' ')[1];
        const decoded = await verifyToken(token, 'a7med');

        // 2. Ensure only users (not admins/sectors) can request
        if (decoded.role !== "user") {
            return next(new appError("Unauthorized user", 403));
        }

        // 3. Find the user in the User model
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return next(new appError("User not found", 404));
        }

        // 4. Check if the user already has a pending request
        const existingRequest = await SectorModel.findOne({ email: user.email, status: 'pending' });
        if (existingRequest) {
            return next(new appError("You already have a pending request", 400));
        }

        // 5. Create a new request with the user's data
        await SectorModel.create({
            email: user.email,
            name: user.name,
            password: user.password, // Note: Ensure this is hashed
            role: user.role, // Optional: Store current role
            status: 'pending', // Default status
            requestedAt: new Date(),
            // Include any other relevant fields from User model
        });

        return res.status(200).send({ 
            msg: 'Request to become a sector submitted successfully',
            user: {
                name: user.name,
                email: user.email,
                // Exclude sensitive data like password in the response
            }
        });

    } catch (err) {
        return next(new appError("Failed to process request. Please try again.", err));
    }
});
