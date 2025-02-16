import { ConfigPlugin } from '@expo/config-plugins';
type Props = {
    license?: string;
    hmsLicense?: string;
    polygonLicense?: string;
};
declare const androidPlugin: ConfigPlugin<Props>;
export default androidPlugin;
