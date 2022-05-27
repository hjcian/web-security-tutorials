**Table of Contents**
- [Web Security 101](#web-security-101)
  - [Same Origin Policy](#same-origin-policy)
  - [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
    - [Simple requests](#simple-requests)
    - [Preflighted requests](#preflighted-requests)
    - [Discussion: Google Cloud Storage (GCS) needs CORS setting](#discussion-google-cloud-storage-gcs-needs-cors-setting)
    - [Discussion: Can we allow multiple origins?](#discussion-can-we-allow-multiple-origins)
    - [Discussion: Public-network resources CANNOT requesting private-network if the public-network is NOT secure](#discussion-public-network-resources-cannot-requesting-private-network-if-the-public-network-is-not-secure)
  - [Cookie](#cookie)
    - [Brief Explained](#brief-explained)
    - [The `Set-Cookie` and `Cookie` headers](#the-set-cookie-and-cookie-headers)
    - [補充](#補充)
    - [The Cookie Policy](#the-cookie-policy)
    - [Harden your Cookie](#harden-your-cookie)
  - [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
  - [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
    - [Reflected XSS](#reflected-xss)
    - [Stored XSS](#stored-xss)
    - [DOM-based XSS](#dom-based-xss)
  - [Content Security Policy (CSP)](#content-security-policy-csp)
  - [Cross-Origin Read Blocking (CORB)](#cross-origin-read-blocking-corb)
  - [Practical Experience: Veracode & on-premise NIS deployment](#practical-experience-veracode--on-premise-nis-deployment)
- [補充資料待整理](#補充資料待整理)

# Web Security 101

## Same Origin Policy
> See also
> - [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS) - StarBugs](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
> - [同源政策 (Same-origin policy) - MDN](https://developer.mozilla.org/zh-TW/docs/Web/Security/Same-origin_policy)
> - [Why is the same origin policy so important? - stackexchange](https://security.stackexchange.com/questions/8264/why-is-the-same-origin-policy-so-important)

- 所謂的「同源 (Same Origin)」是指兩個網站的「通訊協定 (protocol)」、「主機名稱 (host)」與「埠號 (port)」皆相同
- 網頁安全模型在原則上，不允許不同源的網站之間通訊，以保障最基本的網路安全
- 給定 `http://store.company.com/dir/page.html` ，以下各 URLs 與之同源與否：
  1. ✅ `http://store.company.com/dir2/other.html`
  2. ✅ `http://store.company.com/dir/inner/another.html`
  3. 📛 `https://store.company.com/page.html`
  4. 📛 `http://store.company.com:81/dir/page.html`
  5. 📛 `http://news.company.com/dir/page.html`
- 預設規則
  - 但透過 HTML tag (embedding) 內發起的 GET 請求，就算非同源，通常都會被允許
  - 而透過 Javascript 程式碼去發起的請求，都會被限制
- demo
  - `make run-same-origin-policy-demo`
  - or just see [index.html](./same-origin-policy/index.html)

## Cross-Origin Resource Sharing (CORS)
> See also
> - [跨來源資源共用 (CORS) - MDN](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)
> - [CORS Tutorial: A Guide to Cross-Origin Resource Sharing - auth0.com](https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/)

- 前述我們準備的一個例子示範如何用 Javascript 執行「跨來源 HTTP 請求」。而使用 JS 執行的跨來源 HTTP 請求會被瀏覽器預設的 CORS policy 擋下來，而出現如下圖的紅字提示
  ![picture 1](https://i.imgur.com/rxXECZ4.png)
- 而若想要你的 website 能夠跨來源取得其他來源的伺服器資源，會需要該伺服器回傳指定的 HTTP headers
  - e.g. `Access-Control-Allow-Origin`
  - 簡單來說就是要該伺服器實作 website 白名單 (及該 website 的允許行為)
- 瀏覽器則會負責檢查伺服器回傳的 HTTP headers 是否符合 CORS 標準
- 更進一步地說，瀏覽器在**執行跨來源 HTTP 請求**時，會先將 website 發起的請求區分為 **「 Simple requests 」** 與 **「 Preflighted requests 」**，兩者執行細節有所差異

### Simple requests
> See also
> - [CORS: Simple requests - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)

- 簡單來說，你發起的請求只是 `GET` 與 `POST`、且僅包含少數特定的 headers 時，瀏覽器會幫你執行 **simple requests**
- 此時，瀏覽器真的會發送請求給伺服器，並在拿到 response 後做較簡單的檢查。若不合法，則顯示 `blocked by CORS policy`
- 瀏覽器會去檢查一件事：伺服器是否允許此網頁存取它
  - 檢查方式為
- demo:
  - 假設
    - 發起的請求分別為 `GET` 與 `POST`
    - 且沒有帶入額外的 headers (i.e. 只會塞入瀏覽器預設的)
  - `make run-server-for-demo-simple-request` and start live coding
  - go to https://example.com/ and open **DevTool**

### Preflighted requests
> See also
> - [CORS: Preflighted requests - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)

- 其他會對 server data 產生 side-effects 的請求，CORS 規範要求瀏覽器必須先 **preflight a request**、詢問伺服器：「請問我可以使用什麼方法請求呢 🙂 ？」
- 舉例
  - 今天我要發起的請求為 `POST`
  - 但我帶入的 request body content type 為 JSON (`Content-type: application/json`)
  - demo:
    - TODO

### Discussion: Google Cloud Storage (GCS) needs CORS setting
> See also
> - [Configure cross-origin resource sharing (CORS) on a bucket](https://cloud.google.com/storage/docs/configuring-cors)
- 我們會把檔案、圖片放到 GCS 內指定的 **bucket**，且可以取得一個 public URL 來指向該檔案
  - e.g. OOOXXX
- 如果該檔案是一個圖片檔，實務應用會將它直接塞進 `<img src="image link">` tag 裡，讓瀏覽器直接發出請求、拿到圖片、直接呈現
- 但 GCS 預設也不是任何人拿到 URL 都可以存取資源，它會要求你替該 bucket 設定好 CORS，正向表列出有哪些 websites 可以存取你的資源

### Discussion: Can we allow multiple origins?
> See also
> - [Reason: Multiple CORS header 'Access-Control-Allow-Origin' not allowed - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMultipleAllowOriginNotAllowed)

- `Access-Control-Allow-Origin` 並不支援回傳多個 origins 的語法 (無論你空白分隔還是逗點分隔，瀏覽器都不理你)
- 也無法透過設置多個 `Access-Control-Allow-Origin` 在 response header 中來達成
- 建議的做法是伺服器去 **echo** request 中的 `origin` header (當然要檢查在你的白名單內才 echo)

### Discussion: Public-network resources CANNOT requesting private-network if the public-network is NOT secure
![picture 1](https://i.imgur.com/yE0Vfok.png)
- https://stackoverflow.com/questions/66534759/chrome-cors-error-on-request-to-localhost-dev-server-from-remote-site

## Cookie
### Brief Explained
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
### 補充
- https://medium.com/4ing-%E7%9A%84%E8%88%AA%E6%B5%B7%E6%97%A5%E8%AA%8C/fetch-api-%E6%B2%92%E6%9C%89%E5%82%B3%E9%80%81-cookies-fa0befaae40f

References:
- [淺談 Session 與 Cookie：一起來讀 RFC](https://blog.techbridge.cc/2019/08/10/session-and-cookie-rfc/)
- [Using HTTP cookies - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

### The Cookie Policy
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

### Harden your Cookie

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

## Cross-Site Request Forgery (CSRF)

## Cross-Site Scripting (XSS)

### Reflected XSS
### Stored XSS
### DOM-based XSS

## Content Security Policy (CSP)
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
- help to guard XSS

## Cross-Origin Read Blocking (CORB)
- https://juejin.cn/post/6844903831373889550

## Practical Experience: Veracode & on-premise NIS deployment

# 補充資料待整理
- [[熱門面試題] 從輸入網址列到渲染畫面，過程經歷了什麼事？](https://medium.com/starbugs/%E7%86%B1%E9%96%80%E9%9D%A2%E8%A9%A6%E9%A1%8C-%E5%BE%9E%E8%BC%B8%E5%85%A5%E7%B6%B2%E5%9D%80%E5%88%97%E5%88%B0%E6%B8%B2%E6%9F%93%E7%95%AB%E9%9D%A2-%E9%81%8E%E7%A8%8B%E7%B6%93%E6%AD%B7%E4%BA%86%E4%BB%80%E9%BA%BC%E4%BA%8B-4a6cafefe78a)
  - 需要瀏覽器的部分
- [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
  - CORS 的部分待擷取
- self sign certificate
  - https://devcenter.heroku.com/articles/ssl-certificate-self
  - https://serverfault.com/questions/310046/how-to-self-sign-an-ssl-certificate-for-a-specific-domain
    - openssl req -> Common Name

