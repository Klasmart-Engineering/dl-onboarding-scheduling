# Materials & tools

## Tools

- CSV Generator: https://extendsclass.com/csv-generator.html

## Materials

Files for testing can be found at https://drive.google.com/drive/folders/1Hjs3-xf2bGxll7EU-PbL_rS2gYdZxsem.

# TL;DR Summary

All requests to Onboarding application got time out. But it can onboard 3000 `schools` and `classes` successfully.

![Postman timeout](tests/fixtures/postman-timeout.png)

Onboarding application will crashed when onboard more than 1500 users.

While onboarding users, Admin Service scaled up to 6 pods but it might not need this much.

# System information

## K8S

Pod (both Admin Service & Onboarding applications)

```
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 1024Mi
```

Scale rules:

```
Min: 1
Max: 6
```

## Onboarding ExpressJS server

- Timeout is 300 seconds.

# Onboarding schools

## 3000 schools

### 1st try

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:14 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:24 GMT",
        "duration_in_second": 9.798
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:24 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:31 GMT",
        "duration_in_second": 6.819
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:31 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:38 GMT",
        "duration_in_second": 7.218
    },
    {
        "rows": "901 - 1200",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:38 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:44 GMT",
        "duration_in_second": 5.77
    },
    {
        "rows": "1201 - 1500",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:44 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:50 GMT",
        "duration_in_second": 6.033
    },
    {
        "rows": "1501 - 1800",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:50 GMT",
        "end_at": "Fri, 18 Mar 2022 09:49:56 GMT",
        "duration_in_second": 5.562
    },
    {
        "rows": "1801 - 2100",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:49:56 GMT",
        "end_at": "Fri, 18 Mar 2022 09:50:02 GMT",
        "duration_in_second": 6.702
    },
    {
        "rows": "2101 - 2400",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:50:02 GMT",
        "end_at": "Fri, 18 Mar 2022 09:50:08 GMT",
        "duration_in_second": 5.509
    },
    {
        "rows": "2401 - 2700",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:50:08 GMT",
        "end_at": "Fri, 18 Mar 2022 09:50:14 GMT",
        "duration_in_second": 5.676
    },
    {
        "rows": "2701 - 3000",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 09:50:14 GMT",
        "end_at": "Fri, 18 Mar 2022 09:50:19 GMT",
        "duration_in_second": 5.243
    }
]
```

### 2nd try

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:34:36 GMT",
        "end_at": "Fri, 18 Mar 2022 10:34:44 GMT",
        "duration_in_second": 8.475
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:34:44 GMT",
        "end_at": "Fri, 18 Mar 2022 10:34:50 GMT",
        "duration_in_second": 5.799
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:34:50 GMT",
        "end_at": "Fri, 18 Mar 2022 10:34:56 GMT",
        "duration_in_second": 6.017
    },
    {
        "rows": "901 - 1200",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:34:56 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:01 GMT",
        "duration_in_second": 5.318
    },
    {
        "rows": "1201 - 1500",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:01 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:08 GMT",
        "duration_in_second": 6.252
    },
    {
        "rows": "1501 - 1800",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:08 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:13 GMT",
        "duration_in_second": 5.32
    },
    {
        "rows": "1801 - 2100",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:13 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:19 GMT",
        "duration_in_second": 6.015
    },
    {
        "rows": "2101 - 2400",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:19 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:24 GMT",
        "duration_in_second": 4.972
    },
    {
        "rows": "2401 - 2700",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:24 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:29 GMT",
        "duration_in_second": 5.405
    },
    {
        "rows": "2701 - 3000",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:29 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:34 GMT",
        "duration_in_second": 4.895
    }
]
```

# Onboarding classes

## 3000 classes

### 1st try

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:50:31 GMT",
        "end_at": "Fri, 18 Mar 2022 07:50:45 GMT",
        "duration_in_second": 13.872
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:50:45 GMT",
        "end_at": "Fri, 18 Mar 2022 07:50:56 GMT",
        "duration_in_second": 10.804
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:50:56 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:05 GMT",
        "duration_in_second": 9.872
    },
    {
        "rows": "901 - 1200",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:05 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:15 GMT",
        "duration_in_second": 9.662
    },
    {
        "rows": "1201 - 1500",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:15 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:25 GMT",
        "duration_in_second": 9.755
    },
    {
        "rows": "1501 - 1800",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:25 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:34 GMT",
        "duration_in_second": 9.427
    },
    {
        "rows": "1801 - 2100",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:34 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:44 GMT",
        "duration_in_second": 9.964
    },
    {
        "rows": "2101 - 2400",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:44 GMT",
        "end_at": "Fri, 18 Mar 2022 07:51:58 GMT",
        "duration_in_second": 13.398
    },
    {
        "rows": "2401 - 2700",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:51:58 GMT",
        "end_at": "Fri, 18 Mar 2022 07:52:10 GMT",
        "duration_in_second": 11.993
    },
    {
        "rows": "2701 - 3000",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 07:52:10 GMT",
        "end_at": "Fri, 18 Mar 2022 07:52:26 GMT",
        "duration_in_second": 16.523
    }
]
```

### 2nd try

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:48 GMT",
        "end_at": "Fri, 18 Mar 2022 10:35:57 GMT",
        "duration_in_second": 9.326
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:35:57 GMT",
        "end_at": "Fri, 18 Mar 2022 10:36:13 GMT",
        "duration_in_second": 15.341
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:36:13 GMT",
        "end_at": "Fri, 18 Mar 2022 10:36:32 GMT",
        "duration_in_second": 19.798
    },
    {
        "rows": "901 - 1200",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:36:32 GMT",
        "end_at": "Fri, 18 Mar 2022 10:36:42 GMT",
        "duration_in_second": 9.19
    },
    {
        "rows": "1201 - 1500",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:36:42 GMT",
        "end_at": "Fri, 18 Mar 2022 10:36:51 GMT",
        "duration_in_second": 9.192
    },
    {
        "rows": "1501 - 1800",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:36:51 GMT",
        "end_at": "Fri, 18 Mar 2022 10:37:05 GMT",
        "duration_in_second": 13.743
    },
    {
        "rows": "1801 - 2100",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:37:05 GMT",
        "end_at": "Fri, 18 Mar 2022 10:37:24 GMT",
        "duration_in_second": 19.362
    },
    {
        "rows": "2101 - 2400",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:37:24 GMT",
        "end_at": "Fri, 18 Mar 2022 10:37:38 GMT",
        "duration_in_second": 14.495
    },
    {
        "rows": "2401 - 2700",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:37:38 GMT",
        "end_at": "Fri, 18 Mar 2022 10:37:52 GMT",
        "duration_in_second": 13.661
    },
    {
        "rows": "2701 - 3000",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:37:52 GMT",
        "end_at": "Fri, 18 Mar 2022 10:38:04 GMT",
        "duration_in_second": 12.33
    }
]
```

# Onboarding users

## 1001 users

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:14:17 GMT",
        "end_at": "Fri, 18 Mar 2022 10:14:47 GMT",
        "duration_in_second": 30.804
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:14:47 GMT",
        "end_at": "Fri, 18 Mar 2022 10:15:15 GMT",
        "duration_in_second": 27.5
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:15:15 GMT",
        "end_at": "Fri, 18 Mar 2022 10:15:41 GMT",
        "duration_in_second": 26.12
    },
    {
        "rows": "901 - 1001",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:15:41 GMT",
        "end_at": "Fri, 18 Mar 2022 10:15:51 GMT",
        "duration_in_second": 10.021
    }
]
```

## 1500 users

Request timed out but onboard successfully

Report:

```
[
    {
        "rows": "1 - 300",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:39:08 GMT",
        "end_at": "Fri, 18 Mar 2022 10:39:36 GMT",
        "duration_in_second": 28.086
    },
    {
        "rows": "301 - 600",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:39:36 GMT",
        "end_at": "Fri, 18 Mar 2022 10:40:09 GMT",
        "duration_in_second": 32.909
    },
    {
        "rows": "601 - 900",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:40:09 GMT",
        "end_at": "Fri, 18 Mar 2022 10:40:37 GMT",
        "duration_in_second": 27.427
    },
    {
        "rows": "901 - 1200",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:40:37 GMT",
        "end_at": "Fri, 18 Mar 2022 10:41:01 GMT",
        "duration_in_second": 24.501
    },
    {
        "rows": "1201 - 1500",
        "result": "true",
        "errors": [],
        "start_at": "Fri, 18 Mar 2022 10:41:01 GMT",
        "end_at": "Fri, 18 Mar 2022 10:41:49 GMT",
        "duration_in_second": 47.535
    }
]
```

## 3000 users

Application crashed after onboarding only 1500 users -> doesn't have report.

Error log:

```
Error: socket hang up
    at connResetException (node:internal/errors:692:14)
    at TLSSocket.socketOnEnd (node:_http_client:466:23)
    at TLSSocket.emit (node:events:539:35)
    at TLSSocket.emit (node:domain:475:12)
    at endReadableNT (node:internal/streams/readable:1342:12)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  code: 'ECONNRESET',
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: [Function: httpAdapter],
    transformRequest: [ [Function: transformRequest] ],
    transformResponse: [ [Function: transformResponse] ],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: [Function: validateStatus],
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'multipart/form-data; boundary=--------------------------648147367902199825197347',
      Authorization: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NDJjOWE1LWJiNzktNGEzYi04MDVjLWMzY2MzMzZiNWEzOSIsImVtYWlsIjoicWF2bjFAY2FsbWlkLmNvbSIsImV4cCI6MTczNzMxOTE3NCwiaXNzIjoia2lkc2xvb3AifQ.hgecPr86gyb4gNx7Ct-PxENTw07fwBjG6zDKOYVyfVnolX2l7VJtCH9D7bHvDuYsE1Mgv7r70bQ0BVMIqcoTIRUZg9kUUooJu7sE27SvSpVh9N5HW9g-aE4f2LZIX8lu2irUxKRfx-rMdwo65WOH0JbXOVxMSLyLiZGnCMZIakqf8EHfRyNkkL22foARFe3rs2zTjz80_rYc_Sx-Aiylrir5YQ4p9OCc0krEgDuvi77JjcKoYx-RG0IskuZUgm34RUBEIBGPLtvAaX20PvdnWiDld7Lmo2VOnBcCXdvj7d9rLplWoasLuJoczLt7H3eAApD4Ms5q_OtbmxmFDZlM-Q',
      'User-Agent': 'axios/0.26.0'
    },
    method: 'post',
    url: 'https://api.beta.kidsloop.vn/user/graphql',
    data: FormData {
      _overheadLength: 357,
      _valueLength: 212,
      _valuesToMeasure: [Array],
      writable: false,
      readable: true,
      dataSize: 0,
      maxDataSize: 2097152,
      pauseStreams: true,
      _released: true,
      _streams: [],
      _currentStream: null,
      _insideLoop: false,
      _pendingNext: false,
      _boundary: '--------------------------648147367902199825197347',
      _events: [Object: null prototype],
      _eventsCount: 1
    }
  },
  request: <ref *1> Writable {
    _writableState: WritableState {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: true,
      defaultEncoding: 'utf8',
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      onwrite: [Function: bound onwrite],
      writecb: null,
      writelen: 0,
      afterWriteTickInfo: null,
      buffered: [],
      bufferedIndex: 0,
      allBuffers: true,
      allNoop: true,
      pendingcb: 0,
      constructed: true,
      prefinished: false,
      errorEmitted: false,
      emitClose: true,
      autoDestroy: true,
      errored: null,
      closed: false,
      closeEmitted: false,
      [Symbol(kOnFinished)]: []
    },
    _events: [Object: null prototype] {
      response: [Function: handleResponse],
      error: [Function: handleRequestError],
      socket: [Function: handleRequestSocket]
    },
    _eventsCount: 3,
    _maxListeners: undefined,
    _options: {
      maxRedirects: 21,
      maxBodyLength: 10485760,
      protocol: 'https:',
      path: '/user/graphql',
      method: 'POST',
      headers: [Object],
      agent: undefined,
      agents: [Object],
      auth: undefined,
      hostname: 'api.beta.kidsloop.vn',
      port: null,
      nativeProtocols: [Object],
      pathname: '/user/graphql'
    },
    _ended: true,
    _ending: true,
    _redirectCount: 0,
    _redirects: [],
    _requestBodyLength: 35279,
    _requestBodyBuffers: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ],
    _onNativeResponse: [Function (anonymous)],
    _currentRequest: ClientRequest {
      _events: [Object: null prototype],
      _eventsCount: 7,
      _maxListeners: undefined,
      outputData: [],
      outputSize: 0,
      writable: true,
      destroyed: false,
      _last: true,
      chunkedEncoding: true,
      shouldKeepAlive: false,
      maxRequestsOnConnectionReached: false,
      _defaultKeepAlive: true,
      useChunkedEncodingByDefault: true,
      sendDate: false,
      _removedConnection: false,
      _removedContLen: false,
      _removedTE: false,
      _contentLength: null,
      _hasBody: true,
      _trailer: '',
      finished: true,
      _headerSent: true,
      _closed: false,
      socket: [TLSSocket],
      _header: 'POST /user/graphql HTTP/1.1\r\n' +
        'Accept: application/json, text/plain, */*\r\n' +
        'Content-Type: multipart/form-data; boundary=--------------------------648147367902199825197347\r\n' +
        'Authorization: eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NDJjOWE1LWJiNzktNGEzYi04MDVjLWMzY2MzMzZiNWEzOSIsImVtYWlsIjoicWF2bjFAY2FsbWlkLmNvbSIsImV4cCI6MTczNzMxOTE3NCwiaXNzIjoia2lkc2xvb3AifQ.hgecPr86gyb4gNx7Ct-PxENTw07fwBjG6zDKOYVyfVnolX2l7VJtCH9D7bHvDuYsE1Mgv7r70bQ0BVMIqcoTIRUZg9kUUooJu7sE27SvSpVh9N5HW9g-aE4f2LZIX8lu2irUxKRfx-rMdwo65WOH0JbXOVxMSLyLiZGnCMZIakqf8EHfRyNkkL22foARFe3rs2zTjz80_rYc_Sx-Aiylrir5YQ4p9OCc0krEgDuvi77JjcKoYx-RG0IskuZUgm34RUBEIBGPLtvAaX20PvdnWiDld7Lmo2VOnBcCXdvj7d9rLplWoasLuJoczLt7H3eAApD4Ms5q_OtbmxmFDZlM-Q\r\n' +
        'User-Agent: axios/0.26.0\r\n' +
        'Host: api.beta.kidsloop.vn\r\n' +
        'Connection: close\r\n' +
        'Transfer-Encoding: chunked\r\n' +
        '\r\n',
      _keepAliveTimeout: 0,
      _onPendingData: [Function: nop],
      agent: [Agent],
      socketPath: undefined,
      method: 'POST',
      maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
      path: '/user/graphql',
      _ended: false,
      res: null,
      aborted: false,
      timeoutCb: null,
      upgradeOrConnect: false,
      parser: null,
      maxHeadersCount: null,
      reusedSocket: false,
      host: 'api.beta.kidsloop.vn',
      protocol: 'https:',
      _redirectable: [Circular *1],
      [Symbol(kCapture)]: false,
      [Symbol(kNeedDrain)]: true,
      [Symbol(corked)]: 0,
      [Symbol(kOutHeaders)]: [Object: null prototype]
    },
    _currentUrl: 'https://api.beta.kidsloop.vn/user/graphql',
    [Symbol(kCapture)]: false
  },
  response: undefined,
  isAxiosError: true,
  toJSON: [Function: toJSON]
}
```
