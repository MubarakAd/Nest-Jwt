"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../decorator/roles.decorator");
class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.role || !requiredRoles.includes(user.role)) {
            throw new common_1.ForbiddenException(`Access denied. Required role(s): ${requiredRoles.join(', ')}. Your role: ${user?.role || 'NONE'}`);
        }
        return requiredRoles.some((role) => user.role === role);
    }
}
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map