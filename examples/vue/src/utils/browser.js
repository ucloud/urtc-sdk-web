function _isMobile() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|MQQBrowser|WeChat|MicroMessenger)/i)
}

export const isMobile = _isMobile()
