# Hypernovus URL Guard Bot

HUGBOT, Rate-Limit zaman aralıklarına göre kendisini ayarlayıp, Rate-Limit yemeden en optimize ve hızlı şekilde Discord Vanity URL alabilmenize yarar.

Kalıcı veri depolaması için quick.db kullanır.

```javascript
let ratelimitTries = headers.get('x-ratelimit-remaining') //Kalan RateLimit hakkımız.

let ratelimitResetTime = parseInt((headers.get('x-ratelimit-reset-after').toString())) * 1000 
//^ratelimit'in sıfırlanmasına kalan saniye süresi (ms * 1000)

let ratelimitIdealReqInterval = (parseInt(((ratelimitResetTime / ratelimitTries).toString())))
//URL Alma isteği için optimum zaman aralığı.
```

```javascript
if (x.status === 429){ //eğer rate limit hatası alıyorsak

            console.log("Waiting for : " + (ratelimitResetTime));
            await delay(ratelimitResetTime) //ratelimit'in sıfırlanmasını bekle
            tryGettingURL()
}
else { //eğer url alındıysa-alınmaya çalışılıyorsa (hata yoksa)
            console.log("RPS :  " + ratelimitIdealReqInterval)
            console.log("Waiting for : " + (ratelimitIdealReqInterval));
            await delay(ratelimitIdealReqInterval) //optimum süreyi bekle
            tryGettingURL() //tekrar dene
}
``` 

--

Discord'un API'ına sık sık veri-istek göndermeniz RateLimit sürenizin 72 saate kadar uzamasına ve hesaplarınızın zarar görmesine/kapatılmasına sebep olabilir. Bunlardan ben sorumlu değilim. Kendi riskinizi alarak kullanın.

Sending requests very frequently to the Discord API may result in Rate Limits up to 72 hours and your accounts being disabled. I am not responsible for any actions you take with this code. Use at your own risk.