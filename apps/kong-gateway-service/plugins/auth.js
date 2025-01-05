"use strict"

const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const BaseResponse = {
    ErrorResponse: (kong, httpStatus = 401, message = "Unauthorized") => {
        return kong.response.exit(httpStatus, {
            statusCode: httpStatus,
            status: false,
            error: message,
        });
    },
};

class AuthPlugin {
    constructor(config) {
        this.config = config;
    }

    // Helper function to extract token
    extractToken(headers) {
        return !isEmpty(headers.authorization) ? headers.authorization[0].split(" ")[1] : null;
    }

    // Helper function to verify token
    async verifyToken(token) {
        try {
            return jwt.verify(token, this.config.SECRET, {
                algorithms: ["HS256"],
                ignoreExpiration: false,
                issuer: this.config.ISSUER,
                audience: this.config.AUDIENCE,
            });
        } catch {
            return null;
        }
    }

    // Main access function
    async access(kong) {
        try {
            const requestHeaders = await kong.request.getHeaders();
            kong.log.info("Auth Headers:", JSON.stringify({ requestHeaders }));

            const token = this.extractToken(requestHeaders);
            if (!token) return BaseResponse.ErrorResponse(kong);

            const decoded = await this.verifyToken(token);
            if (!decoded) {
                kong.log.err("Error Auth Plugin:", "Unauthorized");
                return BaseResponse.ErrorResponse(kong);
            }

            kong.log.info("Decoded:", JSON.stringify({ decoded }));
            kong.service.request.add_header("X-User-Profile", JSON.stringify(decoded));
            return true;
        } catch (error) {
            kong.log.err("Error Auth Plugin:", error.message);
            return BaseResponse.ErrorResponse(kong);
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
