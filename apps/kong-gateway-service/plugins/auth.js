"use strict";

const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

console.log(process.env.JWT_SECRET);

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

    // Ensure environment variables are set
    if (!this.config.SECRET || !this.config.ISSUER || !this.config.AUDIENCE) {
      throw new Error(
        "JWT_SECRET, JWT_ISSUER, or JWT_CLIENT is not defined in environment variables."
      );
    }
  }

  async access(kong) {
    try {
      const requestHeaders = await kong.request.getHeaders();
      kong.log.info("Auth Headers:", JSON.stringify({ requestHeaders }));

      // Check if Authorization header is present
      if (!isEmpty(requestHeaders.authorization)) {
        const token = requestHeaders.authorization[0].split(" ")[1];

        // Log token for debugging (avoid in production for security reasons)
        kong.log.info("Authorization Token:", token);

        // Decode the JWT token
        const decoded = jwt.verify(token, this.config.SECRET, {
          algorithms: ["HS256"],
          ignoreExpiration: false,
          issuer: this.config.ISSUER,
          audience: this.config.AUDIENCE,
        });

        // Check if the decoded token is valid
        if (isEmpty(decoded)) {
          kong.log.err("Error Auth Plugin:", "Unauthorized - Invalid token");
          return BaseResponse.ErrorResponse(
            kong,
            401,
            "Unauthorized - Invalid token"
          );
        }

        kong.log.info("Decoded:", JSON.stringify({ decoded }));

        // Add decoded token to the request headers user
        kong.service.request.add_header(
          "X-User-Profile",
          JSON.stringify(decoded)
        );

        return decoded;
      } else {
        return BaseResponse.ErrorResponse(
          kong,
          401,
          "Unauthorized - No Authorization header"
        );
      }
    } catch (error) {
      kong.log.err("Error Auth Plugin:", error.message);
      return BaseResponse.ErrorResponse(
        kong,
        401,
        `Unauthorized - ${error.message}`
      );
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
        default: process.env.JWT_SECRET,
      },
    },
    {
      ISSUER: {
        type: "string",
        default: process.env.JWT_ISSUER,
      },
    },
    {
      AUDIENCE: {
        type: "string",
        default: process.env.JWT_CLIENT,
      },
    },
  ],
};
