"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const androidPlugin_1 = __importDefault(require("./androidPlugin"));
const iOSPlugin_1 = __importDefault(require("./iOSPlugin"));
const withBackgroundGeolocation = (config, _props) => {
    const props = _props || {};
    return (0, config_plugins_1.withPlugins)(config, [
        [androidPlugin_1.default, {
                license: props.license,
                hmsLicense: props.hmsLicense,
                polygonLicense: props.polygonLicense
            }],
        [iOSPlugin_1.default, {
            // no props for ios currently.
            }]
    ]);
};
exports.default = withBackgroundGeolocation;
//# sourceMappingURL=index.js.map