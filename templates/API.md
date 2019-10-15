## Load,Store, LOadAddress Order [/GCASL]

### LD [POST]

+ Attributes

    + code: (string,optional) - CASL2 Source Code

+ Request example (application/json)

    + Body

        ```js
        {
          "code": "LD GR1,GR2"
        }
        ```
+ Response 200 (application/json)

    + Body

        ```js
        {
            "result":"OK",
            "code" :[
                {
                    "Code":5138,
                    "Addr":0,
                    "AddrLabel":"",
                    "Op":20,
                    "Length":1,
                    "Token":{
                        "Literal":"LD"
                    }
                }
            ]
        }```