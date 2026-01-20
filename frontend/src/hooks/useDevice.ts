/**
 * 设备检测 Hook
 * 用于在 React 组件中检测设备类型，并响应窗口大小变化
 */

import { useState, useEffect } from 'react';
import { isMobileDevice, isTabletDevice, isIOSDevice, isAndroidDevice } from '@/utils/device';

interface DeviceInfo {
  /** 是否为移动端设备 */
  isMobile: boolean;
  /** 是否为平板设备 */
  isTablet: boolean;
  /** 是否为 iOS 设备 */
  isIOS: boolean;
  /** 是否为 Android 设备 */
  isAndroid: boolean;
  /** 当前窗口宽度 */
  width: number;
  /** 当前窗口高度 */
  height: number;
}

/**
 * 设备检测 Hook
 * 结合屏幕宽度和浏览器内核判断设备类型，并监听窗口大小变化
 * @returns {DeviceInfo} 设备信息对象
 */
export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isIOS: false,
        isAndroid: false,
        width: 0,
        height: 0,
      };
    }

    return {
      isMobile: isMobileDevice(),
      isTablet: isTabletDevice(),
      isIOS: isIOSDevice(),
      isAndroid: isAndroidDevice(),
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo({
        isMobile: isMobileDevice(),
        isTablet: isTabletDevice(),
        isIOS: isIOSDevice(),
        isAndroid: isAndroidDevice(),
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初始检测
    updateDeviceInfo();

    // 监听窗口大小变化
    window.addEventListener('resize', updateDeviceInfo);
    // 监听设备方向变化（移动端横竖屏切换）
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};
