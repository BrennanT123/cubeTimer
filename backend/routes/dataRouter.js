import express from "express";
import * as dataCtrl from "../controllers/dataController.js"

const dataRouter = express.Router();

dataRouter.post("/postNewTime",dataCtrl.postNewTime);
dataRouter.get("/getTime/:timeId",dataCtrl.getTime);
dataRouter.delete("/deleteTime/:timeId",dataCtrl.deleteTime);
dataRouter.put("/putPlusTwo/:timeId",dataCtrl.putPlusTwo);
dataRouter.put("/putDnf/:timeId",dataCtrl.putDNF);
dataRouter.get("/getHistory",dataCtrl.getHistory);
dataRouter.get("/getNumSolves",dataCtrl.getNumSolves);


export default dataRouter;