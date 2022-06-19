**Table of Contents**
- [Web Security 101](#web-security-101)
  - [Same Origin Policy and Cross-Origin Resource Sharing (CORS)](#same-origin-policy-and-cross-origin-resource-sharing-cors)
  - [Cookie](#cookie)
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

## Same Origin Policy and Cross-Origin Resource Sharing (CORS)
- https://hackmd.io/@maxcian/web-security-same-origin-policy-and-cors

## Cookie
- https://hackmd.io/@maxcian/web-security-cookie

## Cross-Site Request Forgery (CSRF)

> See also
> - https://portswigger.net/web-security/csrf

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

