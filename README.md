# web security tutorials

## Same Origin Policy
- 所謂的「同源 (Origin)」是指兩個網站的「通訊協定 (protocol)」、「主機名稱 (host)」與「埠號 (port)」皆相同
- 網頁安全模型在原則上，不允許不同源的網站之間通訊，以保障最基本的網路安全
- 給定 `http://store.company.com/dir/page.html` ，以下各 URLs 與之同源與否：
  - ✅ `http://store.company.com/dir2/other.html`
  - ✅ `http://store.company.com/dir/inner/another.html`
  - 📛 `https://store.company.com/page.html`
  - 📛 `http://store.company.com:81/dir/page.html`
  - 📛 `http://news.company.com/dir/page.html`
- 預設允許
  - 跨來源嵌入行為 (embed)
  -


References:
- [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
- [同源政策 (Same-origin policy)](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)