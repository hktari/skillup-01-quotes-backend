import { NextFunction, Response } from "express";

export function addHeadersToResponse(res: Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}


interface PaginationParams {
  startIdx: number;
  pageSize: number;
}
export function loadPaginationParams(req: any, res: any, next: NextFunction) {
  req.pagination = {
    startIdx: req.query.startIdx ?? 0,
    pageSize: req.query.pageSize ?? 10
  }
  
  next()
}