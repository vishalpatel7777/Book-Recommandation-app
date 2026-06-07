/**
 * Barrel re-export for all server config modules.
 * Import individual modules directly for tree-shaking.
 * This file exists only for convenience.
 */
const env = require("./env");
const appConfig = require("./app.config");
const constants = require("./constants");
const paths = require("./paths");

module.exports = { env, appConfig, constants, paths };