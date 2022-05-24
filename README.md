# web security tutorials

- [web security tutorials](#web-security-tutorials)
  - [Same Origin Policy](#same-origin-policy)
  - [Cookie Brief Explained](#cookie-brief-explained)
    - [The `Set-Cookie` and `Cookie` headers](#the-set-cookie-and-cookie-headers)
  - [Cookie Policy](#cookie-policy)
    - [Common attributes you should apply on cookie](#common-attributes-you-should-apply-on-cookie)
- [補充資料待整理](#補充資料待整理)


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


References:
- [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
- [同源政策 (Same-origin policy)](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)
- [Why is the same origin policy so important?](https://security.stackexchange.com/questions/8264/why-is-the-same-origin-policy-so-important)

## Cookie Brief Explained
- 由於 HTTP 的設計為 stateless，故如何管理並追蹤使用者的「session」，以得知前後不同的 requests 是由同一個使用者所進行的同一組 session，是一個需要想清楚的事
- 最早訂定的標準為 1997 年的「RFC 2109 - HTTP State Management Mechanism」，提出使用 `Set-Cookie` 與 `Cookie` 兩個 headers 來創建 stateful session 的方法
- 事後經過兩次的修訂 (2000 年的 RFC 2965 與 2010 年的 RFC 6265)，使得相關實作規範更加明確
- 我們需要 Cookie 的機制幫我們創造 **stateful session**，此機制係利用瀏覽器支援的 `Set-Cookie` 與 `Cookie` 兩個 headers 來達成
  - 所謂的 `Set-Cookie`，是由伺服器 (server-side) 添加、包含在 HTTP Response 中的 header，瀏覽器作為用戶端收到後儲存下來的 stateful information
  - 所謂的 `Cookie`，是由瀏覽器 (client-side) 添加、包含在 HTTP Request 中的 header，讓伺服器收到後從中解析出 stateful information

### The `Set-Cookie` and `Cookie` headers

- 簡單的 cookie 設置例 (from server to user agent)
  ```
  Set-Cookie: <cookie-name>=<cookie-value>
  ```
- server 透過以下的 HTTP response 告訴 client 儲存這些 cookie pairs
  ```
  HTTP/2.0 200 OK
  Content-Type: text/html
  Set-Cookie: yummy_cookie=choco
  Set-Cookie: tasty_cookie=strawberry

  [page content]
  ```
- client 接著在後續的 requests 中帶上這些 cookie
  ```
  GET /sample_page.html HTTP/2.0
  Host: www.example.org
  Cookie: yummy_cookie=choco; tasty_cookie=strawberry
  ```

References:
- [淺談 Session 與 Cookie：一起來讀 RFC](https://blog.techbridge.cc/2019/08/10/session-and-cookie-rfc/)
- [Using HTTP cookies - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

## Cookie Policy
- Browser 提供了儲存機制 (Web Storage or IndexedDB) 來儲存 cookie，且預設幫我們根據 **「Origin」** 來做隔離
- 而瀏覽器預設實作的機制
  - 頁面可以替它的 domain 或是其 parent domain 設置 cookie
    - 只要 parent domain 不是 public suffix (通常就是一堆 Top level domains, TLDs)
  -  cookie 在它原始的 domain 及 sub-domains 中可被取用 (無倫是 http/https 或不同的 port)
- 但預設的行為其實會造成潛在的(資安)問題，例如：
  - `foo.example.com` 可以對 `example.com` 設置 cookie，可能因此覆蓋掉 `bar.example.com` 對 `example.com` 的設置
    - 故 `foo.example.com` 有了可以攻擊 `bar.example.com` 的破口
  - `http://example.com` 也可以將 `https://example.com` 的 cookie 蓋掉
    - 故 HTTP 站點有了可以攻擊 HTTPS 站點的破口
- 故我們需要一些方法，替 cookie key-value pairs 額外做 **scope** 的設置，來加強資訊安全

### Common attributes you should apply on cookie

✅ Good Attributes
- `Secure`
  - server 可指定 cookie pair 擁有 `Secure` 屬性。擁有此屬性的 cookie 會被限制只能透過安全連線來設置 (實務上，HTTPS 是一種安全連線)
  - 又瀏覽器儲存的 cookie 若有 `Secure` 屬性，就不會在連向 un-encrypted server 時 (i.e. via HTTP)，帶上該 cookie
  - e.g. `Set-Cookie: key=value; Secure`
  - ⚠️ except on localhost
- `HttpOnly`
  - protect from XSS (to prevent cookie from being read from JavaSCript (`document.cookie`))
  - e.g. `Set-Cookie: key=value; Secure; HttpOnly`

📛 Bad Attributes
- `Path`
  - https://web.stanford.edu/class/cs253/ , [Session attacks, Cross-Site Request Forgery (P.22)](https://web.stanford.edu/class/cs253/lectures/Lecture%2005.pdf)
- `Domain`
  - also bad idea (P.27), but need more discussion on this

Experiment List:
- `Secure`, but why? cen we reproduce man-in-the-middle attack?
- `HttpOnly`, have or not to show the JS capability
- CSRF, third-party site embed your site to steal your cookie
  - prevent it by `SameSite` cookie

important:
- Cookies don't obey Same Origin Policy
- This is why Stanford login is `login.stanford.edu` and not `stanford.edu/login` 😲


References:
- [Cross-origin data storage access](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_data_storage_access)
- View, edit, and delete cookies
  - Edge: https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/storage/cookies
  - Chrome: https://developer.chrome.com/docs/devtools/storage/cookies/
- [Restrict access to cookies: about `Secure` and `HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)


# 補充資料待整理
- [[熱門面試題] 從輸入網址列到渲染畫面，過程經歷了什麼事？](https://medium.com/starbugs/%E7%86%B1%E9%96%80%E9%9D%A2%E8%A9%A6%E9%A1%8C-%E5%BE%9E%E8%BC%B8%E5%85%A5%E7%B6%B2%E5%9D%80%E5%88%97%E5%88%B0%E6%B8%B2%E6%9F%93%E7%95%AB%E9%9D%A2-%E9%81%8E%E7%A8%8B%E7%B6%93%E6%AD%B7%E4%BA%86%E4%BB%80%E9%BA%BC%E4%BA%8B-4a6cafefe78a)
  - 需要瀏覽器的部分
- [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
  - CORS 的部分待擷取
- self sign certificate
  - https://devcenter.heroku.com/articles/ssl-certificate-self
  - https://serverfault.com/questions/310046/how-to-self-sign-an-ssl-certificate-for-a-specific-domain
    - openssl req -> Common Name
