"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHeadersToResponse = void 0;
function addHeadersToResponse(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
}
exports.addHeadersToResponse = addHeadersToResponse;
//# sourceMappingURL=server-helpers.js.map