var steamgame = (function(t) {
  'use strict';
  var r = Object.prototype.toString,
    c = function(t) {
      var e =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '';
      return (
        ('Number' !== (e = '' + e) || !Number.isNaN(t)) &&
        r
          .call(t)
          .replace(/.*\s(.*)]$/, '$1')
          .toLowerCase() === e.toLowerCase()
      );
    },
    i = /\/game\/(.*)\//;
  function s() {
    var t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0];
    try {
      var e = window.location.href.match(i),
        r = e ? e[1] : '',
        n = localStorage.getItem('lang')
          ? JSON.parse(localStorage.getItem('lang'))
          : {};
      return t ? 'en' : n[r];
    } catch (t) {
      return 'cn';
    }
  }
  var p =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
          ? self
          : {};
  function e(t, e) {
    return t((e = { exports: {} }), e.exports), e.exports;
  }
  var d = e(function(t) {
    function r(t) {
      if (t)
        return (function(t) {
          for (var e in r.prototype) t[e] = r.prototype[e];
          return t;
        })(t);
    }
    ((t.exports = r).prototype.on = r.prototype.addEventListener = function(
      t,
      e
    ) {
      return (
        (this._callbacks = this._callbacks || {}),
        (this._callbacks['$' + t] = this._callbacks['$' + t] || []).push(e),
        this
      );
    }),
      (r.prototype.once = function(t, e) {
        function r() {
          this.off(t, r), e.apply(this, arguments);
        }
        return (r.fn = e), this.on(t, r), this;
      }),
      (r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function(
        t,
        e
      ) {
        if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
          return (this._callbacks = {}), this;
        var r,
          n = this._callbacks['$' + t];
        if (!n) return this;
        if (1 == arguments.length) return delete this._callbacks['$' + t], this;
        for (var i = 0; i < n.length; i++)
          if ((r = n[i]) === e || r.fn === e) {
            n.splice(i, 1);
            break;
          }
        return this;
      }),
      (r.prototype.emit = function(t) {
        this._callbacks = this._callbacks || {};
        var e = [].slice.call(arguments, 1),
          r = this._callbacks['$' + t];
        if (r)
          for (var n = 0, i = (r = r.slice(0)).length; n < i; ++n)
            r[n].apply(this, e);
        return this;
      }),
      (r.prototype.listeners = function(t) {
        return (
          (this._callbacks = this._callbacks || {}),
          this._callbacks['$' + t] || []
        );
      }),
      (r.prototype.hasListeners = function(t) {
        return !!this.listeners(t).length;
      });
  });
  var m = function(t) {
      return null !== t && 'object' == typeof t;
    },
    y = n;
  function n(t) {
    if (t)
      return (function(t) {
        for (var e in n.prototype) t[e] = n.prototype[e];
        return t;
      })(t);
  }
  (n.prototype.clearTimeout = function() {
    return (
      clearTimeout(this._timer),
      clearTimeout(this._responseTimeoutTimer),
      delete this._timer,
      delete this._responseTimeoutTimer,
      this
    );
  }),
    (n.prototype.parse = function(t) {
      return (this._parser = t), this;
    }),
    (n.prototype.responseType = function(t) {
      return (this._responseType = t), this;
    }),
    (n.prototype.serialize = function(t) {
      return (this._serializer = t), this;
    }),
    (n.prototype.timeout = function(t) {
      if (!t || 'object' != typeof t)
        return (this._timeout = t), (this._responseTimeout = 0), this;
      for (var e in t)
        switch (e) {
          case 'deadline':
            this._timeout = t.deadline;
            break;
          case 'response':
            this._responseTimeout = t.response;
        }
      return this;
    }),
    (n.prototype.retry = function(t, e) {
      return (
        (0 !== arguments.length && !0 !== t) || (t = 1),
        t <= 0 && (t = 0),
        (this._maxRetries = t),
        (this._retries = 0),
        (this._retryCallback = e),
        this
      );
    });
  var o = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];
  (n.prototype._shouldRetry = function(t, e) {
    if (!this._maxRetries || this._retries++ >= this._maxRetries) return !1;
    if (this._retryCallback)
      try {
        var r = this._retryCallback(t, e);
        if (!0 === r) return !0;
        if (!1 === r) return !1;
      } catch (t) {}
    if (e && e.status && 500 <= e.status && 501 != e.status) return !0;
    if (t) {
      if (t.code && ~o.indexOf(t.code)) return !0;
      if (t.timeout && 'ECONNABORTED' == t.code) return !0;
      if (t.crossDomain) return !0;
    }
    return !1;
  }),
    (n.prototype._retry = function() {
      return (
        this.clearTimeout(),
        this.req && ((this.req = null), (this.req = this.request())),
        (this._aborted = !1),
        (this.timedout = !1),
        this._end()
      );
    }),
    (n.prototype.then = function(t, e) {
      if (!this._fullfilledPromise) {
        var i = this;
        this._endCalled,
          (this._fullfilledPromise = new Promise(function(r, n) {
            i.end(function(t, e) {
              t ? n(t) : r(e);
            });
          }));
      }
      return this._fullfilledPromise.then(t, e);
    }),
    (n.prototype.catch = function(t) {
      return this.then(void 0, t);
    }),
    (n.prototype.use = function(t) {
      return t(this), this;
    }),
    (n.prototype.ok = function(t) {
      if ('function' != typeof t) throw Error('Callback required');
      return (this._okCallback = t), this;
    }),
    (n.prototype._isResponseOK = function(t) {
      return (
        !!t &&
        (this._okCallback
          ? this._okCallback(t)
          : 200 <= t.status && t.status < 300)
      );
    }),
    (n.prototype.getHeader = n.prototype.get = function(t) {
      return this._header[t.toLowerCase()];
    }),
    (n.prototype.set = function(t, e) {
      if (m(t)) {
        for (var r in t) this.set(r, t[r]);
        return this;
      }
      return (this._header[t.toLowerCase()] = e), (this.header[t] = e), this;
    }),
    (n.prototype.unset = function(t) {
      return delete this._header[t.toLowerCase()], delete this.header[t], this;
    }),
    (n.prototype.field = function(t, e) {
      if (null == t) throw new Error('.field(name, val) name can not be empty');
      if ((this._data, m(t))) {
        for (var r in t) this.field(r, t[r]);
        return this;
      }
      if (Array.isArray(e)) {
        for (var n in e) this.field(t, e[n]);
        return this;
      }
      if (null == e) throw new Error('.field(name, val) val can not be empty');
      return (
        'boolean' == typeof e && (e = '' + e),
        this._getFormData().append(t, e),
        this
      );
    }),
    (n.prototype.abort = function() {
      return (
        this._aborted ||
          ((this._aborted = !0),
          this.xhr && this.xhr.abort(),
          this.req && this.req.abort(),
          this.clearTimeout(),
          this.emit('abort')),
        this
      );
    }),
    (n.prototype._auth = function(t, e, r, n) {
      switch (r.type) {
        case 'basic':
          this.set('Authorization', 'Basic ' + n(t + ':' + e));
          break;
        case 'auto':
          (this.username = t), (this.password = e);
          break;
        case 'bearer':
          this.set('Authorization', 'Bearer ' + t);
      }
      return this;
    }),
    (n.prototype.withCredentials = function(t) {
      return null == t && (t = !0), (this._withCredentials = t), this;
    }),
    (n.prototype.redirects = function(t) {
      return (this._maxRedirects = t), this;
    }),
    (n.prototype.maxResponseSize = function(t) {
      if ('number' != typeof t) throw TypeError('Invalid argument');
      return (this._maxResponseSize = t), this;
    }),
    (n.prototype.toJSON = function() {
      return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header
      };
    }),
    (n.prototype.send = function(t) {
      var e = m(t),
        r = this._header['content-type'];
      if ((this._formData, e && !this._data))
        Array.isArray(t)
          ? (this._data = [])
          : this._isHost(t) || (this._data = {});
      else if (t && this._data && this._isHost(this._data))
        throw Error("Can't merge these send calls");
      if (e && m(this._data)) for (var n in t) this._data[n] = t[n];
      else
        this._data =
          'string' == typeof t
            ? (r || this.type('form'),
              'application/x-www-form-urlencoded' ==
              (r = this._header['content-type'])
                ? this._data
                  ? this._data + '&' + t
                  : t
                : (this._data || '') + t)
            : t;
      return !e || this._isHost(t) || r || this.type('json'), this;
    }),
    (n.prototype.sortQuery = function(t) {
      return (this._sort = void 0 === t || t), this;
    }),
    (n.prototype._finalizeQueryString = function() {
      var t = this._query.join('&');
      if (
        (t && (this.url += (0 <= this.url.indexOf('?') ? '&' : '?') + t),
        (this._query.length = 0),
        this._sort)
      ) {
        var e = this.url.indexOf('?');
        if (0 <= e) {
          var r = this.url.substring(e + 1).split('&');
          'function' == typeof this._sort ? r.sort(this._sort) : r.sort(),
            (this.url = this.url.substring(0, e) + '?' + r.join('&'));
        }
      }
    }),
    (n.prototype._appendQueryString = function() {}),
    (n.prototype._timeoutError = function(t, e, r) {
      if (!this._aborted) {
        var n = new Error(t + e + 'ms exceeded');
        (n.timeout = e),
          (n.code = 'ECONNABORTED'),
          (n.errno = r),
          (this.timedout = !0),
          this.abort(),
          this.callback(n);
      }
    }),
    (n.prototype._setTimeouts = function() {
      var t = this;
      this._timeout &&
        !this._timer &&
        (this._timer = setTimeout(function() {
          t._timeoutError('Timeout of ', t._timeout, 'ETIME');
        }, this._timeout)),
        this._responseTimeout &&
          !this._responseTimeoutTimer &&
          (this._responseTimeoutTimer = setTimeout(function() {
            t._timeoutError(
              'Response timeout of ',
              t._responseTimeout,
              'ETIMEDOUT'
            );
          }, this._responseTimeout));
    });
  var a = function(t) {
      return t.split(/ *; */).shift();
    },
    u = function(t) {
      return t.split(/ *; */).reduce(function(t, e) {
        var r = e.split(/ *= */),
          n = r.shift(),
          i = r.shift();
        return n && i && (t[n] = i), t;
      }, {});
    },
    l = function(t) {
      return t.split(/ *, */).reduce(function(t, e) {
        var r = e.split(/ *; */),
          n = r[0].slice(1, -1);
        return (t[r[1].split(/ *= */)[1].slice(1, -1)] = n), t;
      }, {});
    },
    g = f;
  function f(t) {
    if (t)
      return (function(t) {
        for (var e in f.prototype) t[e] = f.prototype[e];
        return t;
      })(t);
  }
  function h() {
    this._defaults = [];
  }
  (f.prototype.get = function(t) {
    return this.header[t.toLowerCase()];
  }),
    (f.prototype._setHeaderProperties = function(t) {
      var e = t['content-type'] || '';
      this.type = a(e);
      var r = u(e);
      for (var n in r) this[n] = r[n];
      this.links = {};
      try {
        t.link && (this.links = l(t.link));
      } catch (t) {}
    }),
    (f.prototype._setStatusProperties = function(t) {
      var e = (t / 100) | 0;
      (this.status = this.statusCode = t),
        (this.statusType = e),
        (this.info = 1 == e),
        (this.ok = 2 == e),
        (this.redirect = 3 == e),
        (this.clientError = 4 == e),
        (this.serverError = 5 == e),
        (this.error = (4 == e || 5 == e) && this.toError()),
        (this.created = 201 == t),
        (this.accepted = 202 == t),
        (this.noContent = 204 == t),
        (this.badRequest = 400 == t),
        (this.unauthorized = 401 == t),
        (this.notAcceptable = 406 == t),
        (this.forbidden = 403 == t),
        (this.notFound = 404 == t),
        (this.unprocessableEntity = 422 == t);
    }),
    [
      'use',
      'on',
      'once',
      'set',
      'query',
      'type',
      'accept',
      'auth',
      'withCredentials',
      'sortQuery',
      'retry',
      'ok',
      'redirects',
      'timeout',
      'buffer',
      'serialize',
      'parse',
      'ca',
      'key',
      'pfx',
      'cert'
    ].forEach(function(t) {
      h.prototype[t] = function() {
        return this._defaults.push({ fn: t, arguments: arguments }), this;
      };
    }),
    (h.prototype._setDefaults = function(e) {
      this._defaults.forEach(function(t) {
        e[t.fn].apply(e, t.arguments);
      });
    });
  var v = h,
    b = e(function(t, r) {
      var e;
      function n() {}
      e =
        'undefined' != typeof window
          ? window
          : 'undefined' != typeof self
            ? self
            : p;
      var a = (r = t.exports = function(t, e) {
        return 'function' == typeof e
          ? new r.Request('GET', t).end(e)
          : 1 == arguments.length
            ? new r.Request('GET', t)
            : new r.Request(t, e);
      });
      (r.Request = f),
        (a.getXHR = function() {
          if (
            !(
              !e.XMLHttpRequest ||
              (e.location && 'file:' == e.location.protocol && e.ActiveXObject)
            )
          )
            return new XMLHttpRequest();
          try {
            return new ActiveXObject('Microsoft.XMLHTTP');
          } catch (t) {}
          try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
          } catch (t) {}
          try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
          } catch (t) {}
          try {
            return new ActiveXObject('Msxml2.XMLHTTP');
          } catch (t) {}
          throw Error('Browser-only version of superagent could not find XHR');
        });
      var c = ''.trim
        ? function(t) {
            return t.trim();
          }
        : function(t) {
            return t.replace(/(^\s*|\s*$)/g, '');
          };
      function i(t) {
        if (!m(t)) return t;
        var e = [];
        for (var r in t) o(e, r, t[r]);
        return e.join('&');
      }
      function o(e, r, t) {
        if (null != t)
          if (Array.isArray(t))
            t.forEach(function(t) {
              o(e, r, t);
            });
          else if (m(t)) for (var n in t) o(e, r + '[' + n + ']', t[n]);
          else e.push(encodeURIComponent(r) + '=' + encodeURIComponent(t));
        else null === t && e.push(encodeURIComponent(r));
      }
      function s(t) {
        for (
          var e, r, n = {}, i = t.split('&'), o = 0, s = i.length;
          o < s;
          ++o
        )
          -1 == (r = (e = i[o]).indexOf('='))
            ? (n[decodeURIComponent(e)] = '')
            : (n[decodeURIComponent(e.slice(0, r))] = decodeURIComponent(
                e.slice(r + 1)
              ));
        return n;
      }
      function u(t) {
        return /[\/+]json($|[^-\w])/.test(t);
      }
      function l(t) {
        (this.req = t),
          (this.xhr = this.req.xhr),
          (this.text =
            ('HEAD' != this.req.method &&
              ('' === this.xhr.responseType ||
                'text' === this.xhr.responseType)) ||
            void 0 === this.xhr.responseType
              ? this.xhr.responseText
              : null),
          (this.statusText = this.req.xhr.statusText);
        var e = this.xhr.status;
        1223 === e && (e = 204),
          this._setStatusProperties(e),
          (this.header = this.headers = (function(t) {
            for (
              var e, r, n, i, o = t.split(/\r?\n/), s = {}, a = 0, u = o.length;
              a < u;
              ++a
            )
              -1 !== (e = (r = o[a]).indexOf(':')) &&
                ((n = r.slice(0, e).toLowerCase()),
                (i = c(r.slice(e + 1))),
                (s[n] = i));
            return s;
          })(this.xhr.getAllResponseHeaders())),
          (this.header['content-type'] = this.xhr.getResponseHeader(
            'content-type'
          )),
          this._setHeaderProperties(this.header),
          null === this.text && t._responseType
            ? (this.body = this.xhr.response)
            : (this.body =
                'HEAD' != this.req.method
                  ? this._parseBody(this.text ? this.text : this.xhr.response)
                  : null);
      }
      function f(t, e) {
        var n = this;
        (this._query = this._query || []),
          (this.method = t),
          (this.url = e),
          (this.header = {}),
          (this._header = {}),
          this.on('end', function() {
            var e,
              r = null,
              t = null;
            try {
              t = new l(n);
            } catch (t) {
              return (
                ((r = new Error(
                  'Parser is unable to parse the response'
                )).parse = !0),
                (r.original = t),
                n.xhr
                  ? ((r.rawResponse =
                      void 0 === n.xhr.responseType
                        ? n.xhr.responseText
                        : n.xhr.response),
                    (r.status = n.xhr.status ? n.xhr.status : null),
                    (r.statusCode = r.status))
                  : ((r.rawResponse = null), (r.status = null)),
                n.callback(r)
              );
            }
            n.emit('response', t);
            try {
              n._isResponseOK(t) ||
                (e = new Error(t.statusText || 'Unsuccessful HTTP response'));
            } catch (t) {
              e = t;
            }
            e
              ? ((e.original = r),
                (e.response = t),
                (e.status = t.status),
                n.callback(e, t))
              : n.callback(null, t);
          });
      }
      function h(t, e, r) {
        var n = a('DELETE', t);
        return (
          'function' == typeof e && ((r = e), (e = null)),
          e && n.send(e),
          r && n.end(r),
          n
        );
      }
      (a.serializeObject = i),
        (a.parseString = s),
        (a.types = {
          html: 'text/html',
          json: 'application/json',
          xml: 'text/xml',
          urlencoded: 'application/x-www-form-urlencoded',
          form: 'application/x-www-form-urlencoded',
          'form-data': 'application/x-www-form-urlencoded'
        }),
        (a.serialize = {
          'application/x-www-form-urlencoded': i,
          'application/json': JSON.stringify
        }),
        (a.parse = {
          'application/x-www-form-urlencoded': s,
          'application/json': JSON.parse
        }),
        g(l.prototype),
        (l.prototype._parseBody = function(t) {
          var e = a.parse[this.type];
          return this.req._parser
            ? this.req._parser(this, t)
            : (!e && u(this.type) && (e = a.parse['application/json']),
              e && t && (t.length || t instanceof Object) ? e(t) : null);
        }),
        (l.prototype.toError = function() {
          var t = this.req,
            e = t.method,
            r = t.url,
            n = 'cannot ' + e + ' ' + r + ' (' + this.status + ')',
            i = new Error(n);
          return (i.status = this.status), (i.method = e), (i.url = r), i;
        }),
        (a.Response = l),
        d(f.prototype),
        y(f.prototype),
        (f.prototype.type = function(t) {
          return this.set('Content-Type', a.types[t] || t), this;
        }),
        (f.prototype.accept = function(t) {
          return this.set('Accept', a.types[t] || t), this;
        }),
        (f.prototype.auth = function(t, e, r) {
          1 === arguments.length && (e = ''),
            'object' == typeof e && null !== e && ((r = e), (e = '')),
            r || (r = { type: 'function' == typeof btoa ? 'basic' : 'auto' });
          return this._auth(t, e, r, function(t) {
            if ('function' == typeof btoa) return btoa(t);
            throw new Error('Cannot use basic auth, btoa is not a function');
          });
        }),
        (f.prototype.query = function(t) {
          return (
            'string' != typeof t && (t = i(t)), t && this._query.push(t), this
          );
        }),
        (f.prototype.attach = function(t, e, r) {
          if (e) {
            if (this._data)
              throw Error("superagent can't mix .send() and .attach()");
            this._getFormData().append(t, e, r || e.name);
          }
          return this;
        }),
        (f.prototype._getFormData = function() {
          return (
            this._formData || (this._formData = new e.FormData()),
            this._formData
          );
        }),
        (f.prototype.callback = function(t, e) {
          if (this._shouldRetry(t, e)) return this._retry();
          var r = this._callback;
          this.clearTimeout(),
            t &&
              (this._maxRetries && (t.retries = this._retries - 1),
              this.emit('error', t)),
            r(t, e);
        }),
        (f.prototype.crossDomainError = function() {
          var t = new Error(
            'Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.'
          );
          (t.crossDomain = !0),
            (t.status = this.status),
            (t.method = this.method),
            (t.url = this.url),
            this.callback(t);
        }),
        (f.prototype.buffer = f.prototype.ca = f.prototype.agent = function() {
          return this;
        }),
        (f.prototype.pipe = f.prototype.write = function() {
          throw Error(
            'Streaming is not supported in browser version of superagent'
          );
        }),
        (f.prototype._isHost = function(t) {
          return (
            t &&
            'object' == typeof t &&
            !Array.isArray(t) &&
            '[object Object]' !== Object.prototype.toString.call(t)
          );
        }),
        (f.prototype.end = function(t) {
          return (
            this._endCalled,
            (this._endCalled = !0),
            (this._callback = t || n),
            this._finalizeQueryString(),
            this._end()
          );
        }),
        (f.prototype._end = function() {
          var r = this,
            n = (this.xhr = a.getXHR()),
            t = this._formData || this._data;
          this._setTimeouts(),
            (n.onreadystatechange = function() {
              var t = n.readyState;
              if (
                (2 <= t &&
                  r._responseTimeoutTimer &&
                  clearTimeout(r._responseTimeoutTimer),
                4 == t)
              ) {
                var e;
                try {
                  e = n.status;
                } catch (t) {
                  e = 0;
                }
                if (!e) {
                  if (r.timedout || r._aborted) return;
                  return r.crossDomainError();
                }
                r.emit('end');
              }
            });
          var e = function(t, e) {
            0 < e.total && (e.percent = (e.loaded / e.total) * 100),
              (e.direction = t),
              r.emit('progress', e);
          };
          if (this.hasListeners('progress'))
            try {
              (n.onprogress = e.bind(null, 'download')),
                n.upload && (n.upload.onprogress = e.bind(null, 'upload'));
            } catch (t) {}
          try {
            this.username && this.password
              ? n.open(this.method, this.url, !0, this.username, this.password)
              : n.open(this.method, this.url, !0);
          } catch (t) {
            return this.callback(t);
          }
          if (
            (this._withCredentials && (n.withCredentials = !0),
            !this._formData &&
              'GET' != this.method &&
              'HEAD' != this.method &&
              'string' != typeof t &&
              !this._isHost(t))
          ) {
            var i = this._header['content-type'],
              o = this._serializer || a.serialize[i ? i.split(';')[0] : ''];
            !o && u(i) && (o = a.serialize['application/json']),
              o && (t = o(t));
          }
          for (var s in this.header)
            null != this.header[s] &&
              this.header.hasOwnProperty(s) &&
              n.setRequestHeader(s, this.header[s]);
          return (
            this._responseType && (n.responseType = this._responseType),
            this.emit('request', this),
            n.send(void 0 !== t ? t : null),
            this
          );
        }),
        (a.agent = function() {
          return new v();
        }),
        ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'].forEach(function(
          n
        ) {
          v.prototype[n.toLowerCase()] = function(t, e) {
            var r = new a.Request(n, t);
            return this._setDefaults(r), e && r.end(e), r;
          };
        }),
        (v.prototype.del = v.prototype.delete),
        (a.get = function(t, e, r) {
          var n = a('GET', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.query(e),
            r && n.end(r),
            n
          );
        }),
        (a.head = function(t, e, r) {
          var n = a('HEAD', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.query(e),
            r && n.end(r),
            n
          );
        }),
        (a.options = function(t, e, r) {
          var n = a('OPTIONS', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.send(e),
            r && n.end(r),
            n
          );
        }),
        (a.del = h),
        (a.delete = h),
        (a.patch = function(t, e, r) {
          var n = a('PATCH', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.send(e),
            r && n.end(r),
            n
          );
        }),
        (a.post = function(t, e, r) {
          var n = a('POST', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.send(e),
            r && n.end(r),
            n
          );
        }),
        (a.put = function(t, e, r) {
          var n = a('PUT', t);
          return (
            'function' == typeof e && ((r = e), (e = null)),
            e && n.send(e),
            r && n.end(r),
            n
          );
        });
    });
  b.Request;
  function w(t, e, r, n) {
    !t &&
      e.body &&
      (0 === e.body.code
        ? 'OPTIONS' !== e.req.method && r(e.body)
        : -1001 === e.body.code
          ? (window.location.href = '/')
          : n(e.body)),
      n(t);
  }
  var _ = function(t, e, i, r) {
      var o = Object.assign({}, e.data ? { data: JSON.stringify(e.data) } : {});
      return new Promise(function(r, n) {
        b.get(t)
          .set(
            Object.assign(
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Language: s()
              },
              i ? { Auth: window.localStorage.getItem('auth') } : {}
            )
          )
          .query(Object.assign(e, o))
          .end(function(t, e) {
            w(t, e, r, n);
          });
      });
    },
    T = function(t, e, i, r) {
      var o = Object.assign({}, e.data ? { data: JSON.stringify(e.data) } : {});
      return new Promise(function(r, n) {
        b.post(t)
          .set(
            Object.assign(
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Language: s()
              },
              i ? { Auth: window.localStorage.getItem('auth') } : {}
            )
          )
          .send(Object.assign(e, o))
          .end(function(t, e) {
            w(t, e, r, n);
          });
      });
    },
    S = function(t) {
      return new Promise(function(r, n) {
        b.get(t).end(function(t, e) {
          !t && e.body ? r(e.body) : n();
        });
      });
    },
    E = { get: _, post: T, getJSON: S },
    O = Object.freeze({ get: _, post: T, getJSON: S, default: E }),
    x = function(t, e) {
      if (!(t instanceof Date) || 'string' != typeof e) return '';
      var r = function(t) {
          return t < 10 ? '0' + t : '' + t;
        },
        n = {
          YYYY: t.getFullYear(),
          MM: r(t.getMonth() + 1),
          MEn: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ][t.getMonth()],
          mm: t.getMonth() + 1,
          DD: r(t.getDate()),
          dd: t.getDate(),
          HH: r(t.getHours()),
          hh: t.getHours() < 13 ? r(t.getHours()) : r(t.getHours() - 12),
          min: r(t.getMinutes()),
          sec: r(t.getSeconds()),
          weekday: ['日', '一', '二', '三', '四', '五', '六'][t.getUTCDay()]
        };
      for (var i in n) e = e.replace(i, n[i]);
      return e;
    },
    I = window.STATIC_URL || 'https://cdn.meishakeji.com/',
    M = {
      dateFormat: function(t, e) {
        return x(new Date(t), e);
      },
      staticSource: function(t, e, r) {
        if (t) {
          var n = t.trim();
          return t
            ? n.startsWith('data') ||
              n.startsWith('base64') ||
              n.startsWith('http')
              ? n
              : I +
                n +
                (e && r
                  ? '?x-oss-process=image/resize,m_fill,h_'
                      .concat(r, ',w_')
                      .concat(e)
                  : '')
            : '';
        }
      },
      formatNoData: function(t) {
        var e =
          1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '-';
        return 0 === t || t ? t : e;
      },
      formatArray: function(t) {
        var e =
            1 < arguments.length && void 0 !== arguments[1]
              ? arguments[1]
              : ',',
          r =
            2 < arguments.length && void 0 !== arguments[2]
              ? arguments[2]
              : '-';
        return t && t.length ? t.join(e) : r;
      }
    },
    A = {
      install: function(e) {
        return (
          c(M, 'Object') &&
          (Object.keys(M) || []).forEach(function(t) {
            return e.filter(t, M[t]);
          })
        );
      }
    },
    k = function(t, r) {
      var e = Object.keys(r).reduce(function(t, e) {
        return (t[e] = { value: r[e], writable: !1, configurable: !1 }), t;
      }, {});
      return Object.defineProperties(t, e), t;
    };
  var N = Object.freeze({
      COMMON_API: {
        CHECK_AUTH: 'account/check_auth',
        SESSION_INFO: 'student/games/common/get_session_info',
        ROUND_LIST: 'student/games/common/game_round_list',
        GAME_INFO: 'student/games/common/my_game_info',
        GET_POEMS: 'student/games/common/get_poems',
        GET_LOGIC_PROBLEM: 'student/games/common/get_question',
        SUBMIT_ANSWER: 'student/games/common/submit_answer',
        GEAR_BUY: 'student/games/common/buy_gear',
        BIND_WS: 'student/games/common/bind_websocket',
        LANG: 'common/get_games_language'
      }
    }),
    C = {
      state: {
        leftTime: 0,
        timeInterval: null,
        timeShow: !1,
        timerCurSec: 0,
        timerShow: !1,
        timerDangerous: !1,
        exDone: !1,
        gameSuccess: !1,
        isFinished: !1,
        gameVisibility: {},
        mpProblems: [],
        mpSettings: [],
        mpLevel: -1,
        cwLevel: -1,
        azPts: 0,
        sdTime: -1,
        lhLevel: -1,
        gainKlCoin: 0,
        showMask: !1,
        fsPlayId: '',
        fsSubmitInfo: null,
        rewards: 0
      },
      mutations: {
        SETLEFTTIME: function(t, e) {
          t.leftTime = e;
        },
        DECLEFTTIME: function(t, e) {
          e && c(e, 'Number') && (t.leftTime = Math.max(t.leftTime - e, 0));
        },
        SETREWARDS: function(t, e) {
          t.rewards = e;
        },
        SETFSSUBMITINFO: function(t, e) {
          t.fsSubmitInfo = e;
        },
        SETTIMERDANGEROUS: function(t, e) {
          t.timerDangerous = e;
        },
        SETFSPLAYID: function(t, e) {
          t.fsPlayId = e;
        },
        SETTIMESHOW: function(t, e) {
          t.timeShow = e;
        },
        SETTIMERSHOW: function(t, e) {
          t.timerShow = e;
        },
        SETTIMERCURSEC: function(t, e) {
          t.timerCurSec = e;
        },
        SETSHOWMASK: function(t, e) {
          t.showMask = e;
        },
        SETMPPROBLEMS: function(t, e) {
          t.mpProblems = e;
        },
        SETMPSETTINGS: function(t, e) {
          t.mpSettings = e;
        },
        SETGAMESUCCESS: function(t, e) {
          t.gameSuccess = e;
        },
        SETISFINISHED: function(t, e) {
          t.isFinished = e;
        },
        SETEXDONE: function(t, e) {
          t.exDone = e;
        },
        SETINTERVAL: function(t, e) {
          t.timeInterval = e;
        },
        SETAZPTS: function(t, e) {
          t.azPts = e;
        },
        SETMPLEVEL: function(t, e) {
          t.mpLevel = e;
        },
        SETCWLEVEL: function(t, e) {
          t.cwLevel = e;
        },
        SETLHLEVEL: function(t, e) {
          t.lhLevel = e;
        },
        SETSDTIME: function(t, e) {
          t.sdTime = e;
        },
        SETGAMEVISIBILITY: function(t, e) {
          t.gameVisibility = e;
        },
        SETGAINKLCOIN: function(t, e) {
          t.gainKlCoin = e;
        }
      },
      actions: {
        setLeftTime: function(t, r) {
          var n = t.commit,
            i = t.state;
          return new Promise(function(t) {
            n('SETLEFTTIME', r);
            var e = setInterval(function() {
              0 < i.leftTime ? n('DECLEFTTIME', 1) : (clearInterval(e), t());
            }, 1e3);
            n('SETINTERVAL', e);
          });
        },
        getGameConfig: function(t) {
          var r = t.commit;
          return new Promise(function(e) {
            S(
              'https://cdn.meishakeji.com/steamfe/gameSettings.json?t='.concat(
                new Date().getTime()
              )
            ).then(
              function(t) {
                t &&
                  t.visible &&
                  t.mp &&
                  (r('SETGAMEVISIBILITY', t.visible),
                  r('SETMPSETTINGS', t.mp),
                  e());
              },
              function() {}
            );
          });
        }
      },
      getters: {
        leftTime: function(t) {
          return t.leftTime;
        },
        fsSubmitInfo: function(t) {
          return t.fsSubmitInfo;
        },
        fsPlayId: function(t) {
          return t.fsPlayId;
        },
        timeShow: function(t) {
          return t.timeShow;
        },
        timerCurSec: function(t) {
          return t.timerCurSec;
        },
        timerShow: function(t) {
          return t.timerShow;
        },
        timerDangerous: function(t) {
          return t.timerDangerous;
        },
        showMask: function(t) {
          return t.showMask;
        },
        mpProblems: function(t) {
          return t.mpProblems;
        },
        mpSettings: function(t) {
          return t.mpSettings;
        },
        gameSuccess: function(t) {
          return t.gameSuccess;
        },
        isFinished: function(t) {
          return t.isFinished;
        },
        rewards: function(t) {
          return t.rewards;
        },
        exDone: function(t) {
          return t.exDone;
        },
        timeInterval: function(t) {
          return t.timeInterval;
        },
        azPts: function(t) {
          return t.azPts;
        },
        mpLevel: function(t) {
          return t.mpLevel;
        },
        cwLevel: function(t) {
          return t.cwLevel;
        },
        sdTime: function(t) {
          return t.sdTime;
        },
        lhLevel: function(t) {
          return t.lhLevel;
        },
        gameVisibility: function(t) {
          return t.gameVisibility;
        },
        gainKlCoin: function(t) {
          return t.gainKlCoin;
        }
      }
    };
  function L(t, e) {
    return (
      (function(t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function(t, e) {
        var r = [],
          n = !0,
          i = !1,
          o = void 0;
        try {
          for (
            var s, a = t[Symbol.iterator]();
            !(n = (s = a.next()).done) &&
            (r.push(s.value), !e || r.length !== e);
            n = !0
          );
        } catch (t) {
          (i = !0), (o = t);
        } finally {
          try {
            n || null == a.return || a.return();
          } finally {
            if (i) throw o;
          }
        }
        return r;
      })(t, e) ||
      (function() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance'
        );
      })()
    );
  }
  var D = e(function(t, e) {
    var r, n, S, u, v, E, O, x, I, M, i, A, o, b, s;
    t.exports = ((r = Object.prototype.toString),
    (n = function(t) {
      return Number.isNaN(t) ? 'NaN' : r.call(t).replace(/.*\s(.*)]$/, '$1');
    }),
    (S = function(t, e, r) {
      return !0 === r && 'Array' === n(t)
        ? t.every(function(t) {
            return n(t) === e;
          })
        : n(t) === e;
    }),
    (u = function(t) {
      return Math.min.apply(null, t);
    }),
    (v = function(t) {
      return [Math.min.apply(null, t), Math.max.apply(null, t)];
    }),
    (E = function(t, e) {
      if (Array.isArray(t)) return t;
      if (Symbol.iterator in Object(t))
        return (function(t, e) {
          var r = [],
            n = !0,
            i = !1,
            o = void 0;
          try {
            for (
              var s, a = t[Symbol.iterator]();
              !(n = (s = a.next()).done) &&
              (r.push(s.value), !e || r.length !== e);
              n = !0
            );
          } catch (t) {
            (i = !0), (o = t);
          } finally {
            try {
              !n && a.return && a.return();
            } finally {
              if (i) throw o;
            }
          }
          return r;
        })(t, e);
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      );
    }),
    (O = function() {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      if (!e.length) return 0;
      var n = new Array(e.length),
        i = !0,
        o = !1,
        s = void 0;
      try {
        for (
          var a, u = Object.entries(e)[Symbol.iterator]();
          !(i = (a = u.next()).done);
          i = !0
        ) {
          var c = a.value,
            l = E(c, 2),
            f = l[0],
            h = l[1];
          if (!S(h, 'Number')) return 0;
          try {
            n[f] = h.toString().split('.')[1].length;
          } catch (t) {
            n[f] = 0;
          }
        }
      } catch (t) {
        (o = !0), (s = t);
      } finally {
        try {
          !i && u.return && u.return();
        } finally {
          if (o) throw s;
        }
      }
      var p,
        d = Math.pow(10, ((p = n), Math.max.apply(null, p))),
        m = 0,
        y = !0,
        g = !1,
        v = void 0;
      try {
        for (
          var b, w = e[Symbol.iterator]();
          !(y = (b = w.next()).done);
          y = !0
        )
          m += b.value * d;
      } catch (t) {
        (g = !0), (v = t);
      } finally {
        try {
          !y && w.return && w.return();
        } finally {
          if (g) throw v;
        }
      }
      return m / d;
    }),
    (x = function() {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      var n = e.map(function(t, e) {
        return e ? -t : t;
      });
      return O.apply(
        void 0,
        (function(t) {
          if (Array.isArray(t)) {
            for (var e = 0, r = Array(t.length); e < t.length; e++) r[e] = t[e];
            return r;
          }
          return Array.from(t);
        })(n)
      );
    }),
    (I = function() {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      if (!e.length) return 0;
      var n = new Array(e.length),
        i = 0,
        o = 1,
        s = !0,
        a = !1,
        u = void 0;
      try {
        for (
          var c, l = Object.entries(e)[Symbol.iterator]();
          !(s = (c = l.next()).done);
          s = !0
        ) {
          var f = c.value,
            h = E(f, 2),
            p = h[0],
            d = h[1];
          if (!S(d, 'Number')) return 0;
          try {
            n[p] = d.toString().split('.')[1].length;
          } catch (t) {
            n[p] = 0;
          }
          (i += n[p]), (o *= d * Math.pow(10, n[p]));
        }
      } catch (t) {
        (a = !0), (u = t);
      } finally {
        try {
          !s && l.return && l.return();
        } finally {
          if (a) throw u;
        }
      }
      return o / Math.pow(10, i);
    }),
    (M = function() {
      for (var t = arguments.length, e = Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
      if (!e.length) return 0;
      for (var n = e[0], i = 0; i < e.length - 1; i++) {
        if (!S(e[i], 'Number') || !S(e[i + 1], 'Number')) return 0;
        var o = void 0,
          s = void 0;
        try {
          o = n.toString().split('.')[1].length;
        } catch (t) {
          o = 0;
        }
        try {
          s = e[i + 1].toString().split('.')[1].length;
        } catch (t) {
          s = 0;
        }
        var a = Math.max(o, s);
        n = (n * Math.pow(10, a)) / (e[i + 1] * Math.pow(10, a));
      }
      return n;
    }),
    (i = Object.freeze({ add: O, sub: x, multi: I, div: M })),
    (A = function(t, e) {
      return !S([t, e], 'Number', !0) || e < 0
        ? 0
        : parseFloat(Number.prototype.toFixed.call(t, parseInt(e)));
    }),
    (o = Object.freeze({ round: A })),
    (b = function(t) {
      var e = E(t, 2),
        r = E(e[0], 2),
        n = r[0],
        i = r[1],
        o = E(e[1], 2),
        s = o[0],
        a = o[1];
      if (S([n, i, s, a], 'Number', !0)) {
        if (n === s) return null;
        var u = A(M(x(i, a), x(n, s)), 5);
        return { k: u, b: A(x(i, I(u, n)), 5) };
      }
    }),
    (s = Object.freeze({
      pointOnLine: function(t, e, r) {
        var n = E(t, 2),
          i = n[0],
          o = n[1],
          s = E(e, 2),
          a = E(s[0], 2),
          u = a[0],
          c = a[1],
          l = E(s[1], 2),
          f = l[0],
          h = l[1];
        if (!S([i, o, u, c, f, h], 'Number', !0)) return !1;
        var p = v([u, f]),
          d = v([c, h]);
        if (((r = r || 0.01), i < p[0] || i > p[1] || o < d[0] || o > d[1]))
          return !1;
        if (Math.abs(x(c, h)) < Math.abs(x(u, f))) {
          var m = [o, i];
          (i = m[0]), (o = m[1]);
          var y = [c, u];
          (u = y[0]), (c = y[1]);
          var g = [h, f];
          (f = g[0]), (h = g[1]);
        }
        return (
          Math.abs(x(M(x(i, u), x(o, c)), M(x(u, f), x(c, h)))) < r ||
          Math.abs(x(M(x(i, f), x(o, h)), M(x(u, f), x(c, h)))) < r
        );
      },
      getKB: b,
      getVertical: function(t, e, r) {
        var n = E(t, 2),
          i = n[0],
          o = n[1],
          s = E(e, 2),
          a = E(s[0], 2),
          u = a[0],
          c = a[1],
          l = E(s[1], 2),
          f = l[0],
          h = l[1];
        if (S([i, o, u, c, f, h, r], 'Number', !0)) {
          var p = b([[u, c], [f, h]]),
            d = void 0,
            m = void 0;
          if (p)
            if (p.k) {
              var y = A(-M(1, p.k), 5),
                g = A(x(o, I(y, i)), 5),
                v = A(M(r, 2, Math.sqrt(O(1, Math.pow(y, 2)))), 5);
              (d = [A(x(i, v), 3), A(O(i, v), 3)]),
                (m = d.map(function(t) {
                  return A(O(I(y, t), g), 3);
                }));
            } else (d = [i, i]), (m = [x(o, M(r, 2)), O(o, M(r, 2))]);
          else (d = [x(i, M(r, 2)), O(i, M(r, 2))]), (m = [o, o]);
          return d.map(function(t, e) {
            return [t, m[e]];
          });
        }
      },
      getParallel: function(t, e, r) {
        var n = E(t, 2),
          i = n[0],
          o = n[1],
          s = E(e, 2),
          a = E(s[0], 2),
          u = a[0],
          c = a[1],
          l = E(s[1], 2),
          f = l[0],
          h = l[1];
        if (S([i, o, u, c, f, h, r], 'Number', !0)) {
          var p = b([[u, c], [f, h]]),
            d = void 0,
            m = void 0;
          if (p) {
            var y = A(M(r, 2, Math.sqrt(O(1, Math.pow(p.k, 2)))), 5),
              g = A(x(o, I(p.k, i)), 5);
            (d = [A(x(i, y), 3), A(O(i, y), 3)]),
              (m = d.map(function(t) {
                return A(O(I(p.k, t), g), 3);
              }));
          } else (d = [i, i]), (m = [x(o, M(r, 2)), O(o, M(r, 2))]);
          return d.map(function(t, e) {
            return [t, m[e]];
          });
        }
      },
      getExtension: function(t, e, r) {
        var n = E(t, 2),
          i = n[0],
          o = n[1],
          s = E(e, 2),
          a = E(s[0], 2),
          u = a[0],
          c = a[1],
          l = E(s[1], 2),
          f = l[0],
          h = l[1];
        if (S([i, o, u, c, f, h, r], 'Number', !0)) {
          var p = b([[u, c], [f, h]]),
            d = void 0,
            m = void 0;
          if (p) {
            var y = A(M(r, Math.sqrt(O(1, Math.pow(p.k, 2)))), 5);
            (d = [A(x(i, y), 3), A(O(i, y), 3)]),
              (m = d.map(function(t) {
                return A(O(I(p.k, t), p.b), 3);
              }));
          } else (d = [i, i]), (m = [x(o, M(r, 2)), O(o, M(r, 2))]);
          return d.map(function(t, e) {
            return [t, m[e]];
          });
        }
      },
      getAngle: function(t) {
        var e = E(t, 2),
          r = E(e[0], 2),
          n = r[0],
          i = r[1],
          o = E(e[1], 2),
          s = o[0],
          a = o[1];
        return S([n, i, s, a], 'Number', !0)
          ? M(I(Math.atan2(x(n, s), x(i, a)), 180), Math.PI)
          : 0;
      },
      getYFromX: function(t, e) {
        var r = E(e, 2),
          n = E(r[0], 2),
          i = n[0],
          o = n[1],
          s = E(r[1], 2),
          a = s[0],
          u = s[1];
        if (S([t, i, o, a, u], 'Number', !0)) {
          var c = b([[i, o], [a, u]]);
          return c ? A(O(I(c.k, t), c.b), 3) : null;
        }
      },
      getXFromY: function(t, e) {
        var r = E(e, 2),
          n = E(r[0], 2),
          i = n[0],
          o = n[1],
          s = E(r[1], 2),
          a = s[0],
          u = s[1];
        if (S([t, i, o, a, u], 'Number', !0)) {
          var c = b([[i, o], [a, u]]);
          return c ? (c.k ? A(M(x(t, c.b), c.k), 3) : null) : i;
        }
      },
      lineCross: function(t, e) {
        var r = E(t, 2),
          n = E(r[0], 2),
          i = n[0],
          o = n[1],
          s = E(r[1], 2),
          a = s[0],
          u = s[1],
          c = E(e, 2),
          l = E(c[0], 2),
          f = l[0],
          h = l[1],
          p = E(c[1], 2),
          d = p[0],
          m = p[1];
        if (S([i, o, a, u, f, h, d, m], 'Number', !0)) {
          var y = x(I(x(i, f), x(u, h)), I(x(o, h), x(a, f))),
            g = x(I(x(i, d), x(u, m)), I(x(o, m), x(a, d)));
          if (0 <= I(y, g)) return !1;
          var v = x(I(x(f, i), x(m, o)), I(x(h, o), x(d, i))),
            b = O(v, y, -g);
          if (0 <= I(v, b)) return !1;
          var w = M(v, x(g, y)),
            _ = I(w, x(a, i)),
            T = I(w, x(u, o));
          return [O(i, _), O(o, T)].map(function(t) {
            return A(t, 3);
          });
        }
      },
      getClosestPointIdx: function(t, e, r) {
        var n = E(t, 2),
          i = n[0],
          o = n[1];
        if (S([i, o, r], 'Number', !0) && Array.isArray(e) && e.length) {
          var s = e.map(function(t) {
              return A(O(Math.pow(x(t[0], i), 2), Math.pow(x(t[1], o), 2)), 3);
            }),
            a = u(s);
          return a > Math.pow(r, 2)
            ? -1
            : s.findIndex(function(t) {
                return t === a;
              });
        }
        return -1;
      },
      getClosetLineIdx: function(t, e, r) {
        var n = E(t, 2),
          s = n[0],
          a = n[1];
        if (S([s, a, r], 'Number', !0) && Array.isArray(e) && e.length) {
          var i = e.map(function(t) {
              var e = b([t[0], t[t.length - 1]]);
              if (e) {
                if (e.k) {
                  var r = A(-M(1, e.k), 5),
                    n = A(x(a, I(r, s)), 5),
                    i = A(M(x(n, e.b), x(e.k, r)), 5),
                    o = A(O(I(e.k, i), e.b), 5);
                  return A(O(Math.pow(x(i, s), 2), Math.pow(x(o, a), 2)), 3);
                }
                return A(Math.pow(x(t[0][1], a), 2), 3);
              }
              return A(Math.pow(x(t[0][0], s), 2), 3);
            }),
            o = u(i);
          return o > Math.pow(r, 2)
            ? -1
            : i.findIndex(function(t) {
                return t === o;
              });
        }
        return -1;
      }
    })),
    Object.assign({}, i, o, s));
  });
  return (
    (t.$http = E),
    (t.initSteam = function(t) {
      var e =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '';
      e && k(window, { STATIC_URL: e }), k(window, { $http: O }), t.use(A);
    }),
    (t.CONFIG = N),
    (t.miniModule = C),
    (t.addLine = function(t, e, r) {
      for (
        var n = d3
            .line()
            .x(function(t) {
              return t[0];
            })
            .y(function(t) {
              return t[1];
            }),
          i = t.append('path').attr('d', n(e)),
          o = Object.entries(r),
          s = 0;
        s < o.length;
        s++
      ) {
        var a = L(o[s], 2),
          u = a[0],
          c = a[1];
        i = i.attr(u, c);
      }
    }),
    (t.addPoint = function(t, e, r) {
      for (
        var n = t
            .append('circle')
            .attr('cx', e[0])
            .attr('cy', e[1]),
          i = Object.entries(r),
          o = 0;
        o < i.length;
        o++
      ) {
        var s = L(i[o], 2),
          a = s[0],
          u = s[1];
        n = n.attr(a, u);
      }
    }),
    (t.addText = function(t, e, r, n) {
      for (
        var i = t
            .append('text')
            .text(e)
            .attr('x', r[0])
            .attr('y', r[1]),
          o = Object.entries(n),
          s = 0;
        s < o.length;
        s++
      ) {
        var a = L(o[s], 2),
          u = a[0],
          c = a[1];
        i = i.attr(u, c);
      }
    }),
    (t.dateFormat = x),
    (t.dateDiff = function(t, e, r) {
      if (!(t instanceof Date && e instanceof Date)) return 0;
      var n = t.getTime(),
        i = e.getTime();
      return (
        {
          sec: parseInt((i - n) / 1e3),
          min: parseInt((i - n) / 1e3 / 60),
          hour: parseInt((i - n) / 1e3 / 60 / 60),
          day: parseInt((i - n) / 1e3 / 60 / 60 / 24)
        }[r] || 0
      );
    }),
    (t.addDate = function(t, e, r) {
      if (!(t instanceof Date) || 'number' != typeof e || 'string' != typeof r)
        return null;
      return new Date(
        t.getTime() + { sec: 1e3, min: 6e4, hour: 36e5, day: 864e5 }[r] * e
      );
    }),
    (t.toUnixTime = function(t) {
      return t instanceof Date ? parseInt(t.getTime() / 1e3) : 0;
    }),
    (t.timeDuration = function(t, e) {
      if (!(t instanceof Date && e instanceof Date)) return null;
      var r = (e.getTime() - t.getTime()) / 1e3,
        n = +parseFloat(r % 1).toPrecision(12),
        i = Math.floor(r),
        o = parseInt(i / 3600);
      return [o, parseInt((i - 3600 * o) / 60), i % 60, Math.round(100 * n)];
    }),
    (t.toMMssmm = function(t) {
      var e = function(t) {
        return (t = t.toString())[2] ? t[0] + t[1] : t[1] ? t : '0' + t;
      };
      return ''
        .concat(e(Math.floor(t / 1e3 / 60)), ':')
        .concat(e(Math.floor((t / 1e3) % 60)), '.')
        .concat(e((t % 1e3) / 10));
    }),
    (t.filters = A),
    (t.requestFullScreen = function(i) {
      return new Promise(function(t, e) {
        var r =
          i.requestFullScreen ||
          i.webkitRequestFullScreen ||
          i.mozRequestFullScreen ||
          i.msRequestFullscreen;
        if (r) r.call(i), t();
        else if (void 0 !== window.ActiveXObject) {
          var n = new window.ActiveXObject('WScript.Shell');
          null !== n && (n.SendKeys('{F11}'), t()), e();
        }
        e();
      });
    }),
    (t.exitFullscreen = function() {
      return new Promise(function(t, e) {
        var r =
          document.exitFullscreen ||
          document.webkitCancelFullScreen ||
          document.mozCancelFullScreen ||
          document.msExitFullscreen;
        if (r) r.call(document), t();
        else if (void 0 !== window.ActiveXObject) {
          var n = new window.ActiveXObject('WScript.Shell');
          null !== n && (n.SendKeys('{ESC}'), t()), e();
        }
        e();
      });
    }),
    (t.getLineLabelPosition = function(t, e, r, n) {
      var i = L(t, 2),
        o = L(i[0], 2),
        s = o[0],
        a = o[1],
        u = L(i[1], 2),
        c = u[0],
        l = u[1],
        f = L(e, 2),
        h = L(f[0], 2),
        p = h[0],
        d = h[1],
        m = L(f[1], 2),
        y = m[0],
        g = m[1],
        v = L(r, 2),
        b = v[0],
        w = v[1],
        _ = [D.round((p + y) / 2, 3), D.round((d + g) / 2, 3)],
        T = D.getVertical(_, [[p, d], [y, g]], n || 80)
          .sort(function(t, e) {
            return t[1] - e[1];
          })
          .map(function(t) {
            return [D.round(t[0] - b / 2, 3), t[1]];
          }),
        S = !0,
        E = !1,
        O = void 0;
      try {
        for (
          var x, I = T[Symbol.iterator]();
          !(S = (x = I.next()).done);
          S = !0
        ) {
          var M = x.value;
          if (M[0] >= s && M[0] + b <= c && M[1] >= a && M[1] + w <= l)
            return M;
        }
      } catch (t) {
        (E = !0), (O = t);
      } finally {
        try {
          S || null == I.return || I.return();
        } finally {
          if (E) throw O;
        }
      }
      return null;
    }),
    (t.getLang = s),
    (t.setLang = function(t, e) {
      try {
        var r = localStorage.getItem('lang')
          ? JSON.parse(localStorage.getItem('lang'))
          : {};
        (r[t] = e), localStorage.setItem('lang', JSON.stringify(r));
      } catch (t) {}
    }),
    (t.setAllGameLangToLocal = function(r) {
      var s =
          1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
        n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [];
      if (r)
        try {
          var a = Object.keys(r).reduce(function(t, e) {
              return (t[n[e] || e] = r[e]), t;
            }, {}),
            u = localStorage.getItem('lang')
              ? JSON.parse(localStorage.getItem('lang'))
              : {};
          return (
            Object.keys(a).forEach(function(t) {
              var e = u[t],
                r = a[t],
                n = r.some(function(t) {
                  return 'en' === t;
                }),
                i = r.some(function(t) {
                  return 'zh-cn' === t;
                }),
                o = !!~s.indexOf(t);
              !e || c(e, 'Array')
                ? (u[t] = n && o ? 'en' : 'cn')
                : 'cn' !== e || i
                  ? 'en' !== e || n || (u[t] = 'cn')
                  : (u[t] = 'en');
            }),
            localStorage.setItem('lang', JSON.stringify(u)),
            { local: u, server: a }
          );
        } catch (t) {
          return { local: 'cn', server: 'cn' };
        }
    }),
    (t.setGameLangToLocal = function(t, e, r) {
      var n = 3 < arguments.length && void 0 !== arguments[3] && arguments[3];
      try {
        if (!t || !e || !r) return;
        var i = localStorage.getItem('lang')
            ? JSON.parse(localStorage.getItem('lang'))
            : {},
          o = t[r] || [],
          s = i[e] || '',
          a = o.some(function(t) {
            return 'en' === t;
          }),
          u = o.some(function(t) {
            return 'zh-cn' === t;
          });
        return (
          o.length
            ? !s || c(s, 'Array')
              ? (i[e] = a && n ? 'en' : 'cn')
              : 'cn' !== s || u
                ? 'en' !== s || a || (i[e] = 'cn')
                : (i[e] = 'en')
            : (i[e] = 'cn'),
          localStorage.setItem('lang', JSON.stringify(i)),
          { local: s, server: o }
        );
      } catch (t) {
        return { local: 'cn', server: [] };
      }
    }),
    (t.isType = c),
    (t.getType = function(t) {
      return Number.isNaN(t) ? 'NaN' : r.call(t).replace(/.*\s(.*)]$/, '$1');
    }),
    (t.getQueryObj = function() {
      return window.location.search
        .substr(1)
        .split('&')
        .reduce(function(t, e) {
          var r = e.split('=');
          return r[0] && r[1] && (t[r[0]] = r[1]), t;
        }, {});
    }),
    (t.sleep = function(e) {
      return new Promise(function(t) {
        setTimeout(function() {
          t();
        }, e);
      });
    }),
    (t.preLoadImg = function(n, i) {
      if (!Array.isArray(n)) return Promise.resolve();
      for (
        var t = new Array(n.length),
          e = function(r) {
            t[r] = new Promise(function(t) {
              var e = new Image();
              (e.onload = t), (e.src = (i || '') + n[r]);
            });
          },
          r = 0;
        r < n.length;
        r++
      )
        e(r);
      return Promise.all(t);
    }),
    t
  );
})({});
