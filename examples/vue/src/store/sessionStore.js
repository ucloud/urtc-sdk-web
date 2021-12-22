export function saveStore(data = {channel: '', username: ''}) {
  sessionStorage.setItem('my-rtc-store', JSON.stringify(data))
}

export function loadStore() {
  const data = sessionStorage.getItem('my-rtc-store')
  try {
    const p = JSON.parse(data) || {channel: '', username: ''}
    return p
  } catch (err) {
    alert('数据读取失败，请重新输入频道号及用户名')
  }
}
