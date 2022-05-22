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
- 預設規則
  - 透過 HTML tag (embedding) 內引起的請求，通常都會被允許
  - 透過 JS code 去發起的請求，都會被限制
  - see example [same-origin-policy/index.html](./same-origin-policy/index.html)
- 許多資安的破口就是在那些 embedding 的請求，瀏覽器沒幫你擋下來所造成
  - 利用此種機制所做的攻擊，被稱為 **「跨站請求偽造 (Cross-Site Request Forgery, CSRF)」**
  - 故 **CSRF token** 的設計就是會了進一步阻擋這類攻擊


References:
- [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
- [同源政策 (Same-origin policy)](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)
