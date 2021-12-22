export function getPictureURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", function () {
      resolve(this.result)
    }, false)
    reader.addEventListener("error", function (err) {
      reject(err)
    }, false)
    reader.readAsDataURL(file)
  })
}
