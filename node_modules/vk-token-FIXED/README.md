## vk-token FIXED!!!
I fix error, when you have no token. If you use bad login or password you will get a string: "notoken"

Original repo: https://github.com/TrueLecter/vk-token

Node js module to easily get vk token from login and password.

## Usage example

```js
var vktoken = require('vk-token');

vktoken.getAccessToken(username, password, function(error, token){
	console.log(token);
});
```

## Full signature
```js
getAccessToken(username, password, callback, appid, scopes)
```

- **username** - e-mail or phone number registred on vk.com
- **password** - user password
- **callback** - callback function.
The callback argument gets 3 arguments:
    1. **error** - request module errors if any. **null** otherwise
    2. **token** - vk access token. **null** if any errors
    3. **response** - request module last response.
- **appid** - application id to use. If nothing is specified, android official app id is used. You can pass 'android', 'ios' or 'wp' as argument for specific platform.
- **scopes** - comma-separated or array scopes list. Possible scopes are notify, friends, photos, audio, video, docs, notes, pages, status, offers, questions, wall, groups, messages, notifications, stats, ads, offline. Default are all of them.
