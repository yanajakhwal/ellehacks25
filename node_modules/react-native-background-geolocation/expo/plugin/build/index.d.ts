import { ConfigPlugin } from '@expo/config-plugins';
declare const withBackgroundGeolocation: ConfigPlugin<{
    /**
     * Android license Default ""
     */
    license?: string;
    /**
     * Huawei HMS license Default ""
     */
    hmsLicense?: string;
    /**
     * Polygon Geofencing License Default ""
     */
    polygonLicense?: string;
} | void>;
export default withBackgroundGeolocation;
