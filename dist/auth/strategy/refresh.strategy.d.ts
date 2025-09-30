import { Strategy } from 'passport-jwt';
import { Request } from 'express';
declare const RefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshStrategy extends RefreshStrategy_base {
    constructor();
    validate(req: Request, payload: any): Promise<any>;
}
export {};
