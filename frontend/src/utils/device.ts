/**
 * 设备检测工具
 * 结合屏幕宽度和浏览器内核（User Agent）来判断是否为移动端设备
 */

/**
 * 检测是否为移动端设备
 * 结合屏幕宽度（<= 768px）和 User Agent 来判断
 * @returns {boolean} 是否为移动端设备
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. 通过屏幕宽度判断（响应式断点）
  const isSmallScreen = window.innerWidth <= 768;

  // 2. 通过 User Agent 判断移动端浏览器内核
  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';
  
  // 移动端设备特征（包括各种移动浏览器内核）
  // NOTE: 添加了 Safari 相关的检测，确保 iOS Safari 能被正确识别
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|palm|maemo|plucker|kindle|fennec|hiptop|palmos|skyfire|zune|windows phone|windows mobile|iemobile|wpdesktop|ucbrowser|micromessenger|qqbrowser|baiduboxapp|baidubrowser|sogoumobilebrowser|liebaofast|safari/i;
  
  const isMobileUA = mobileRegex.test(userAgent);

  // 3. 通过触摸支持判断（移动端通常支持触摸）
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 4. 检测是否为 iOS 设备（iOS Safari 需要特殊处理）
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  // 5. 综合判断：
  // - 如果是 iOS 设备且屏幕宽度 <= 768px，直接判定为移动端
  // - 否则：屏幕宽度小 且 (移动端 UA 或 有触摸支持)
  // 这样可以避免桌面浏览器缩小窗口时被误判为移动端
  if (isIOS && isSmallScreen) {
    return true;
  }
  
  return isSmallScreen && (isMobileUA || hasTouchSupport);
};

/**
 * 检测是否为平板设备
 * @returns {boolean} 是否为平板设备
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';
  const tabletRegex = /ipad|android(?!.*mobile)|tablet|playbook|silk|kindle|windows phone|windows mobile|wpdesktop/i;
  
  return tabletRegex.test(userAgent) && window.innerWidth > 768 && window.innerWidth <= 1024;
};

/**
 * 检测是否为 iOS 设备
 * @returns {boolean} 是否为 iOS 设备
 */
export const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';
  return /iphone|ipad|ipod/i.test(userAgent);
};

/**
 * 检测是否为 Android 设备
 * @returns {boolean} 是否为 Android 设备
 */
export const isAndroidDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';
  return /android/i.test(userAgent);
};
