import { Router } from "express";
const router = Router();
import {
  getAllEmployee,
  createEmployee,
  getEmployee,
} from "../controllers/employee.js";

router.route("/").get(getAllEmployee).post(createEmployee);

router.route("/:id").get(getEmployee);

export default router;
