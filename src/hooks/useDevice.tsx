import useWindowDimensions from "./useWindowDimensions"

export enum DeviceType {
    MOBILE = 'MOBILE',
    TABLET = 'TABLET',
    DESKTOP = 'DESKTOP',
}

export enum DevicesWidth {
    MOBILE = 768,
    TABLET = 1024,
    DESKTOP = 1280
}

const useDeviceDimensions = () =>{
    const { width, height } = useWindowDimensions();
    const getActualDeviceType = () => {
        if(width && width < DevicesWidth.MOBILE){
            return DeviceType.MOBILE;
        }
        if(width && width < DevicesWidth.TABLET){
            return DeviceType.TABLET;
        }
        return DeviceType.DESKTOP;
    }
    return {
        actualDeciveType: getActualDeviceType(),
        isDesktop: getActualDeviceType() === DeviceType.DESKTOP,
        isTablet: getActualDeviceType() === DeviceType.TABLET,
        isMobile: getActualDeviceType() === DeviceType.MOBILE,
    }
}
export default useDeviceDimensions;