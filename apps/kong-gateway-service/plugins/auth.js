"use strict"

const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

const BaseResponse = {
    ErrorResponse: (kong, httpStatus, message) => {
        return kong.response.exit(httpStatus || 401, {
            statusCode: httpStatus || 401,
            status: false,
            error: message || "Unauthorized",
        });
    },
};

class AuthPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const requestHeaders = await kong.request.getHeaders();
            kong.log.info("Auth Headers:", JSON.stringify({ requestHeaders }));
            if (!isEmpty(requestHeaders.authorization)) {
                const token = requestHeaders.authorization[0].split(" ")[1];
                const decoded = jwt.verify(token, this.config.SECRET, {
                    algorithms: ["HS256"],
                    ignoreExpiration: false,
                    issuer: this.config.ISSUER,
                    audience: this.config.AUDIENCE,
                });

                if (isEmpty(decoded)) {
                    kong.log.err("Error Auth Plugin:", "Unauthorized");
                    return BaseResponse.ErrorResponse(kong, 401, "Unauthorized");
                }

                kong.log.info("Decoded:", JSON.stringify({ decoded }));
                // add decoded token to the request headers user
                kong.service.request.add_header(
                    "X-User-Profile",
                    JSON.stringify(decoded)
                );
                return decoded;
            } else {
                return BaseResponse.ErrorResponse(kong, 401, "Unauthorized");
            }
        } catch (error) {
            kong.log.err("Error Auth Plugin:", error.message);
            return BaseResponse.ErrorResponse(kong, 401, "Unauthorized");
        }
    }
}

module.exports = {
    Plugin: AuthPlugin,
    Version: "0.1.0",
    name: "auth",
    Schema: [
        {
            SECRET: {
                type: "string",
                default: process.env.SECRET,
            },
        },
        {
            ISSUER: {
                type: "string",
                default: process.env.ISSUER,
            },
        },
        {
            AUDIENCE: {
                type: "string",
                default: process.env.AUDIENCE,
            },
        },
    ],
};
