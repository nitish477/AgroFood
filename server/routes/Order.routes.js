import express from "express"
import { CreateOrder, getOrderByid } from "../controller/Order.js"

const router = express.Router() 

router.post("/:userid",CreateOrder)
router.get("/:userid",getOrderByid)

export default router