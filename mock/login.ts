import { MockMethod } from "vite-plugin-mock";

export default {
  url: '/login',
  method: 'post',
  response: () => {

    return {
      "code": 0,
      "msg": null,
      "data": {
        "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOjEsInVzZXJfa2V5IjoiNjc4MjA4YjktZjI0OS00NjM5LThmOGUtOWNmOGQyYTg4MWZjIiwidXNlcm5hbWUiOiJhZG1pbiJ9.yAqyGQvmB-dIfRTDDdzrtu5FzS0v5f3jIoJ9XPnF7NHxju21kQMF6HKPup9YrSXXpUTqlyQlr1G3flFSwkBc4A",
        "expires_in": 720
      }
    }
  }
} as MockMethod