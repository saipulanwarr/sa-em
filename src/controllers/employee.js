import Employee from "../models/employee.js";
import { StatusCodes } from "http-status-codes";

export const getAllEmployee = async (req, res) => {
  const { search } = req.query;
  let queryObject = {};

  if (search) {
    queryObject.$or = [
      { first_name: { $regex: search, $options: "i" } },
      { last_name: { $regex: search, $options: "i" } },
      { company_name: { $regex: search, $options: "i" } },
    ];
  }

  // setup pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const employee = await Employee.find(queryObject).skip(skip).limit(limit);

  const totalEmployee = await Employee.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalEmployee / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalEmployee, numOfPages, currentPage: page, employee });
};

export const createEmployee = async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(StatusCodes.CREATED).json({ employee });
};

export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.status(StatusCodes.OK).json({ employee });
};
