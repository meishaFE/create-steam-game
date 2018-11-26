var steamgame = (function(e) {
  'use strict';
  var n = Object.prototype.toString,
    s = function(e) {
      var t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '';
      return (
        ('Number' !== (t = '' + t) || !Number.isNaN(e)) &&
        n
          .call(e)
          .replace(/.*\s(.*)]$/, '$1')
          .toLowerCase() === t.toLowerCase()
      );
    },
    o = /\/game\/(.*)\//;
  function a() {
    var e = 0 < arguments.length && void 0 !== arguments[0] && arguments[0];
    try {
      var t = window.location.href.match(o),
        n = t ? t[1] : '',
        r = localStorage.getItem('lang')
          ? JSON.parse(localStorage.getItem('lang'))
          : {};
      return e ? 'en' : r[n];
    } catch (e) {
      return 'cn';
    }
  }
  var u = require('superagent');
  function c(e, t, n, r) {
    !e &&
      t.body &&
      (0 === t.body.code
        ? 'OPTIONS' !== t.req.method && n(t.body)
        : -1001 === t.body.code
          ? (window.location.href = '/')
          : r(t.body)),
      r(e);
  }
  var t = function(e, t, o, n) {
      var i = Object.assign({}, t.data ? { data: JSON.stringify(t.data) } : {});
      return new Promise(function(n, r) {
        u.get(e)
          .set(
            Object.assign(
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Language: a()
              },
              o ? { Auth: window.localStorage.getItem('auth') } : {}
            )
          )
          .query(Object.assign(t, i))
          .end(function(e, t) {
            c(e, t, n, r);
          });
      });
    },
    r = function(e, t, o, n) {
      var i = Object.assign({}, t.data ? { data: JSON.stringify(t.data) } : {});
      return new Promise(function(n, r) {
        u.post(e)
          .set(
            Object.assign(
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Language: a()
              },
              o ? { Auth: window.localStorage.getItem('auth') } : {}
            )
          )
          .send(Object.assign(t, i))
          .end(function(e, t) {
            c(e, t, n, r);
          });
      });
    },
    i = function(e) {
      return new Promise(function(n, r) {
        u.get(e).end(function(e, t) {
          !e && t.body ? n(t.body) : r();
        });
      });
    },
    l = { get: t, post: r, getJSON: i },
    f = Object.freeze({ get: t, post: r, getJSON: i, default: l }),
    m = function(e, t) {
      if (!(e instanceof Date) || 'string' != typeof t) return '';
      var n = function(e) {
          return e < 10 ? '0' + e : '' + e;
        },
        r = {
          YYYY: e.getFullYear(),
          MM: n(e.getMonth() + 1),
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
          ][e.getMonth()],
          mm: e.getMonth() + 1,
          DD: n(e.getDate()),
          dd: e.getDate(),
          HH: n(e.getHours()),
          hh: e.getHours() < 13 ? n(e.getHours()) : n(e.getHours() - 12),
          min: n(e.getMinutes()),
          sec: n(e.getSeconds()),
          weekday: ['日', '一', '二', '三', '四', '五', '六'][e.getUTCDay()]
        };
      for (var o in r) t = t.replace(o, r[o]);
      return t;
    },
    g = window.STATIC_URL || 'https://cdn.meishakeji.com/',
    S = {
      dateFormat: function(e, t) {
        return m(new Date(e), t);
      },
      staticSource: function(e, t, n) {
        if (e) {
          var r = e.trim();
          return e
            ? r.startsWith('data') ||
              r.startsWith('base64') ||
              r.startsWith('http')
              ? r
              : g +
                r +
                (t && n
                  ? '?x-oss-process=image/resize,m_fill,h_'
                      .concat(n, ',w_')
                      .concat(t)
                  : '')
            : '';
        }
      },
      formatNoData: function(e) {
        var t =
          1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '-';
        return 0 === e || e ? e : t;
      },
      formatArray: function(e) {
        var t =
            1 < arguments.length && void 0 !== arguments[1]
              ? arguments[1]
              : ',',
          n =
            2 < arguments.length && void 0 !== arguments[2]
              ? arguments[2]
              : '-';
        return e && e.length ? e.join(t) : n;
      }
    },
    d = {
      install: function(t) {
        return (
          s(S, 'Object') &&
          (Object.keys(S) || []).forEach(function(e) {
            return t.filter(e, S[e]);
          })
        );
      }
    },
    v = function(e, n) {
      var t = Object.keys(n).reduce(function(e, t) {
        return (e[t] = { value: n[t], writable: !1, configurable: !1 }), e;
      }, {});
      return Object.defineProperties(e, t), e;
    };
  var T = Object.freeze({
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
    h = {
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
        fsSubmitInfo: null
      },
      mutations: {
        SETLEFTTIME: function(e, t) {
          e.leftTime = t;
        },
        DECLEFTTIME: function(e, t) {
          t && s(t, 'Number') && (e.leftTime = Math.max(e.leftTime - t, 0));
        },
        SETFSSUBMITINFO: function(e, t) {
          e.fsSubmitInfo = t;
        },
        SETTIMERDANGEROUS: function(e, t) {
          e.timerDangerous = t;
        },
        SETFSPLAYID: function(e, t) {
          e.fsPlayId = t;
        },
        SETTIMESHOW: function(e, t) {
          e.timeShow = t;
        },
        SETTIMERSHOW: function(e, t) {
          e.timerShow = t;
        },
        SETTIMERCURSEC: function(e, t) {
          e.timerCurSec = t;
        },
        SETSHOWMASK: function(e, t) {
          e.showMask = t;
        },
        SETMPPROBLEMS: function(e, t) {
          e.mpProblems = t;
        },
        SETMPSETTINGS: function(e, t) {
          e.mpSettings = t;
        },
        SETGAMESUCCESS: function(e, t) {
          e.gameSuccess = t;
        },
        SETISFINISHED: function(e, t) {
          e.isFinished = t;
        },
        SETEXDONE: function(e, t) {
          e.exDone = t;
        },
        SETINTERVAL: function(e, t) {
          e.timeInterval = t;
        },
        SETAZPTS: function(e, t) {
          e.azPts = t;
        },
        SETMPLEVEL: function(e, t) {
          e.mpLevel = t;
        },
        SETCWLEVEL: function(e, t) {
          e.cwLevel = t;
        },
        SETLHLEVEL: function(e, t) {
          e.lhLevel = t;
        },
        SETSDTIME: function(e, t) {
          e.sdTime = t;
        },
        SETGAMEVISIBILITY: function(e, t) {
          e.gameVisibility = t;
        },
        SETGAINKLCOIN: function(e, t) {
          e.gainKlCoin = t;
        }
      },
      actions: {
        setLeftTime: function(e, n) {
          var r = e.commit,
            o = e.state;
          return new Promise(function(e) {
            r('SETLEFTTIME', n);
            var t = setInterval(function() {
              0 < o.leftTime ? r('DECLEFTTIME', 1) : (clearInterval(t), e());
            }, 1e3);
            r('SETINTERVAL', t);
          });
        },
        getGameConfig: function(e) {
          var n = e.commit;
          return new Promise(function(t) {
            i(
              '/game/static/gameSettings.json?t='.concat(new Date().getTime())
            ).then(
              function(e) {
                e &&
                  e.visible &&
                  e.mp &&
                  (n('SETGAMEVISIBILITY', e.visible),
                  n('SETMPSETTINGS', e.mp),
                  t());
              },
              function() {}
            );
          });
        }
      },
      getters: {
        leftTime: function(e) {
          return e.leftTime;
        },
        fsSubmitInfo: function(e) {
          return e.fsSubmitInfo;
        },
        fsPlayId: function(e) {
          return e.fsPlayId;
        },
        timeShow: function(e) {
          return e.timeShow;
        },
        timerCurSec: function(e) {
          return e.timerCurSec;
        },
        timerShow: function(e) {
          return e.timerShow;
        },
        timerDangerous: function(e) {
          return e.timerDangerous;
        },
        showMask: function(e) {
          return e.showMask;
        },
        mpProblems: function(e) {
          return e.mpProblems;
        },
        mpSettings: function(e) {
          return e.mpSettings;
        },
        gameSuccess: function(e) {
          return e.gameSuccess;
        },
        isFinished: function(e) {
          return e.isFinished;
        },
        exDone: function(e) {
          return e.exDone;
        },
        timeInterval: function(e) {
          return e.timeInterval;
        },
        azPts: function(e) {
          return e.azPts;
        },
        mpLevel: function(e) {
          return e.mpLevel;
        },
        cwLevel: function(e) {
          return e.cwLevel;
        },
        sdTime: function(e) {
          return e.sdTime;
        },
        lhLevel: function(e) {
          return e.lhLevel;
        },
        gameVisibility: function(e) {
          return e.gameVisibility;
        },
        gainKlCoin: function(e) {
          return e.gainKlCoin;
        }
      }
    };
  function P(e, t) {
    return (
      (function(e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function(e, t) {
        var n = [],
          r = !0,
          o = !1,
          i = void 0;
        try {
          for (
            var a, u = e[Symbol.iterator]();
            !(r = (a = u.next()).done) &&
            (n.push(a.value), !t || n.length !== t);
            r = !0
          );
        } catch (e) {
          (o = !0), (i = e);
        } finally {
          try {
            r || null == u.return || u.return();
          } finally {
            if (o) throw i;
          }
        }
        return n;
      })(e, t) ||
      (function() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance'
        );
      })()
    );
  }
  var D = require('mathjs-geo');
  return (
    (e.$http = l),
    (e.initSteam = function(e) {
      var t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : '';
      t && v(window, { STATIC_URL: t }), v(window, { $http: f }), e.use(d);
    }),
    (e.CONFIG = T),
    (e.miniModule = h),
    (e.addLine = function(e, t, n) {
      for (
        var r = d3
            .line()
            .x(function(e) {
              return e[0];
            })
            .y(function(e) {
              return e[1];
            }),
          o = e.append('path').attr('d', r(t)),
          i = Object.entries(n),
          a = 0;
        a < i.length;
        a++
      ) {
        var u = P(i[a], 2),
          c = u[0],
          s = u[1];
        o = o.attr(c, s);
      }
    }),
    (e.addPoint = function(e, t, n) {
      for (
        var r = e
            .append('circle')
            .attr('cx', t[0])
            .attr('cy', t[1]),
          o = Object.entries(n),
          i = 0;
        i < o.length;
        i++
      ) {
        var a = P(o[i], 2),
          u = a[0],
          c = a[1];
        r = r.attr(u, c);
      }
    }),
    (e.addText = function(e, t, n, r) {
      for (
        var o = e
            .append('text')
            .text(t)
            .attr('x', n[0])
            .attr('y', n[1]),
          i = Object.entries(r),
          a = 0;
        a < i.length;
        a++
      ) {
        var u = P(i[a], 2),
          c = u[0],
          s = u[1];
        o = o.attr(c, s);
      }
    }),
    (e.dateFormat = m),
    (e.dateDiff = function(e, t, n) {
      if (!(e instanceof Date && t instanceof Date)) return 0;
      var r = e.getTime(),
        o = t.getTime();
      return (
        {
          sec: parseInt((o - r) / 1e3),
          min: parseInt((o - r) / 1e3 / 60),
          hour: parseInt((o - r) / 1e3 / 60 / 60),
          day: parseInt((o - r) / 1e3 / 60 / 60 / 24)
        }[n] || 0
      );
    }),
    (e.addDate = function(e, t, n) {
      if (!(e instanceof Date) || 'number' != typeof t || 'string' != typeof n)
        return null;
      return new Date(
        e.getTime() + { sec: 1e3, min: 6e4, hour: 36e5, day: 864e5 }[n] * t
      );
    }),
    (e.toUnixTime = function(e) {
      return e instanceof Date ? parseInt(e.getTime() / 1e3) : 0;
    }),
    (e.timeDuration = function(e, t) {
      if (!(e instanceof Date && t instanceof Date)) return null;
      var n = (t.getTime() - e.getTime()) / 1e3,
        r = +parseFloat(n % 1).toPrecision(12),
        o = Math.floor(n),
        i = parseInt(o / 3600);
      return [i, parseInt((o - 3600 * i) / 60), o % 60, Math.round(100 * r)];
    }),
    (e.toMMssmm = function(e) {
      var t = function(e) {
        return (e = e.toString())[2] ? e[0] + e[1] : e[1] ? e : '0' + e;
      };
      return ''
        .concat(t(Math.floor(e / 1e3 / 60)), ':')
        .concat(t(Math.floor((e / 1e3) % 60)), '.')
        .concat(t((e % 1e3) / 10));
    }),
    (e.filters = d),
    (e.requestFullScreen = function(o) {
      return new Promise(function(e, t) {
        var n =
          o.requestFullScreen ||
          o.webkitRequestFullScreen ||
          o.mozRequestFullScreen ||
          o.msRequestFullscreen;
        if (n) n.call(o), e();
        else if (void 0 !== window.ActiveXObject) {
          var r = new window.ActiveXObject('WScript.Shell');
          null !== r && (r.SendKeys('{F11}'), e()), t();
        }
        t();
      });
    }),
    (e.exitFullscreen = function() {
      return new Promise(function(e, t) {
        var n =
          document.exitFullscreen ||
          document.webkitCancelFullScreen ||
          document.mozCancelFullScreen ||
          document.msExitFullscreen;
        if (n) n.call(document), e();
        else if (void 0 !== window.ActiveXObject) {
          var r = new window.ActiveXObject('WScript.Shell');
          null !== r && (r.SendKeys('{ESC}'), e()), t();
        }
        t();
      });
    }),
    (e.getLineLabelPosition = function(e, t, n, r) {
      var o = P(e, 2),
        i = P(o[0], 2),
        a = i[0],
        u = i[1],
        c = P(o[1], 2),
        s = c[0],
        l = c[1],
        f = P(t, 2),
        m = P(f[0], 2),
        g = m[0],
        S = m[1],
        d = P(f[1], 2),
        v = d[0],
        T = d[1],
        h = P(n, 2),
        I = h[0],
        w = h[1],
        E = [D.round((g + v) / 2, 3), D.round((S + T) / 2, 3)],
        p = D.getVertical(E, [[g, S], [v, T]], r || 80)
          .sort(function(e, t) {
            return e[1] - t[1];
          })
          .map(function(e) {
            return [D.round(e[0] - I / 2, 3), e[1]];
          }),
        y = !0,
        b = !1,
        O = void 0;
      try {
        for (
          var L, M = p[Symbol.iterator]();
          !(y = (L = M.next()).done);
          y = !0
        ) {
          var N = L.value;
          if (N[0] >= a && N[0] + I <= s && N[1] >= u && N[1] + w <= l)
            return N;
        }
      } catch (e) {
        (b = !0), (O = e);
      } finally {
        try {
          y || null == M.return || M.return();
        } finally {
          if (b) throw O;
        }
      }
      return null;
    }),
    (e.getLang = a),
    (e.setLang = function(e, t) {
      try {
        var n = localStorage.getItem('lang')
          ? JSON.parse(localStorage.getItem('lang'))
          : {};
        (n[e] = t), localStorage.setItem('lang', JSON.stringify(n));
      } catch (e) {}
    }),
    (e.setAllGameLangToLocal = function(n) {
      var a =
          1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
        r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [];
      if (n) {
        var u = Object.keys(n).reduce(function(e, t) {
            return (e[r[t] || t] = n[t]), e;
          }, {}),
          c = localStorage.getItem('lang')
            ? JSON.parse(localStorage.getItem('lang'))
            : {};
        return (
          Object.keys(u).forEach(function(e) {
            var t = c[e],
              n = u[e],
              r = n.some(function(e) {
                return 'en' === e;
              }),
              o = n.some(function(e) {
                return 'zh-cn' === e;
              }),
              i = !!~a.indexOf(e);
            !t || s(t, 'Array')
              ? (c[e] = r && i ? 'en' : 'cn')
              : 'cn' !== t || o
                ? 'en' !== t || r || (c[e] = 'cn')
                : (c[e] = 'en');
          }),
          localStorage.setItem('lang', JSON.stringify(c)),
          { local: c, server: u }
        );
      }
    }),
    (e.setGameLangToLocal = function(e, t, n) {
      var r = 3 < arguments.length && void 0 !== arguments[3] && arguments[3];
      if (e && t && n) {
        var o = localStorage.getItem('lang')
            ? JSON.parse(localStorage.getItem('lang'))
            : {},
          i = e[n],
          a = o[t],
          u = i.some(function(e) {
            return 'en' === e;
          }),
          c = i.some(function(e) {
            return 'zh-cn' === e;
          });
        return (
          !a || s(a, 'Array')
            ? (o[t] = u && r ? 'en' : 'cn')
            : 'cn' !== a || c
              ? 'en' !== a || u || (o[t] = 'cn')
              : (o[t] = 'en'),
          localStorage.setItem('lang', JSON.stringify(o)),
          { local: a, server: i }
        );
      }
    }),
    (e.isType = s),
    (e.getType = function(e) {
      return Number.isNaN(e) ? 'NaN' : n.call(e).replace(/.*\s(.*)]$/, '$1');
    }),
    (e.getQueryObj = function() {
      return window.location.search
        .substr(1)
        .split('&')
        .reduce(function(e, t) {
          var n = t.split('=');
          return n[0] && n[1] && (e[n[0]] = n[1]), e;
        }, {});
    }),
    (e.sleep = function(t) {
      return new Promise(function(e) {
        setTimeout(function() {
          e();
        }, t);
      });
    }),
    (e.preLoadImg = function(r, o) {
      if (!Array.isArray(r)) return Promise.resolve();
      for (
        var e = new Array(r.length),
          t = function(n) {
            e[n] = new Promise(function(e) {
              var t = new Image();
              (t.onload = e), (t.src = (o || '') + r[n]);
            });
          },
          n = 0;
        n < r.length;
        n++
      )
        t(n);
      return Promise.all(e);
    }),
    e
  );
})({});
