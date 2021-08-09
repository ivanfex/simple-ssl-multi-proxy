# Simple SSL Multi-Proxy
Silly multi-port reverse proxy if everyday is not the day to setup a Docker/Nginx one.

## Instructions
- Clone and run `npm install` 
- Install [mkcert](https://github.com/FiloSottile/mkcert).
- Run mkcert with the hostname to secure `mkcert [hostname]` in the simple-ssl-multi-proxy directory.
- Create a `.env` file at the root of the directory and set a `HOST` variable to your hostname.
- Create a `configs.json` with an array of config objects:
```
[
  {
    "name": "Unsecure Service 1",
    "targetServiceUrl": "http://unsecure.server.com:8000",
    "port": 3001
  },
  {
    "name": "Dangerous Server 2",
    "targetServiceUrl": "http://dangerous.server.com:8080",
    "port": 3002
  },
  {
    "name": "Perilous App 2",
    "targetServiceUrl": "http://perilous.app.com:5000",
    "port": 3003
  }
]
```
- Run `npm start`
- Request to your `https://[hostname]:[port]`!
