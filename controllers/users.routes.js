import { Router} from "express";
import * as uc from "./userController.js"
import * as uf from "./userFeaturesController.js"



const router = Router()




router.post('/signup',uc.signup)//signup
router.post('/login',uc.login)
router.post('/permession_change',uc.changePermission)//for making user --> admin
router.post('/add_link',uc.addLink)//adding link (user &admin)
router.post('/link_check',uf.checkLink)//main use check from db
router.post('/report_result/:url/:status',uf.reportResult)
router.post('/sendRequest',uf.createApprovalRequest) 
router.get('/readRequests',uc.seeRequests)
router.put('/editCategory',uc.editCattegory)
router.post('/sendEmail',uc.forgetPassword)
router.post('/resetPassword',uc.resetPassword)
router.get('/getWrongReports',uc.getWrongReports)
router.post('/removeAcc',uc.deleteAcc)


router.post('/addReq',uf.RequestaddLink)//user request to add a link
router.post('/removeReq',uf.RequestremoveLink)//user request to remove a link
router.post('/modifyReq',uf.RequestModifyLink)//user request to modify a link
router.get('/getadd',uc.getAddRequests)//admin check adding link requests
router.get('/getRemove',uc.getRemoveRequests)//admin check removing requests
router.get('/getModify',uc.getModifyRequests)//admin check modifying requests
router.post('/applyAdd',uc.ApplyAddRequests)//admin approve on user request
router.post('/applyRemove',uc.ApplyremoveRequests)//admin approve on user request
router.post('/removeAdmin',uc.removeAdmin)//for making admin --> user

router.post('/reqToBeSector',uf.RequestToBeSector)
router.get('/getSectorRequests',uc.getSectorRequests)
router.post('/applySectorRequests',uc.ApplySectorRequests)
export default router;



