/* eslint-disable indent */
/**
 * 请求统一处理方法, 支持GET、POST请求、加载JSON文件
 *
 * writtern by pomelo
 *
 * 使用方法：
 *  Get请求：
 *    $http.get([请求地址:String], [请求参数:Object], [是否添加auth:Boolean], [其它选项:Object]).then([成功处理:Function], [错误处理:Function]);
 *  Post请求：
 *    $http.post([请求地址:String], [请求参数:Object], [是否添加auth:Boolean], [其它选项:Object]).then([成功处理:Function], [错误处理:Function]);
 *  加载JSON文件：
 *    $http.getJSON([资源地址:String]).then([成功处理:Function], [错误处理:Function]);
 *
 * 其它选项说明：
 *  {
 *    noToast:Boolean 出错时默认会提示，如果该请求不想提示，设为true
 *  }
 */
import { getLang } from './lang';
import superagent from 'superagent';

function handle(err, res, resolve, reject) {
  if (!err && res.body) {
    if (res.body.code === 0) {
      if (res.req.method !== 'OPTIONS') {
        resolve(res.body);
      }
    } else if (res.body.code === -1001) {
      window.location.href = '/';
    } else {
      reject(res.body);
    }
  }
  reject(err);
}

const get = function(url, query, withAuth, options) {
  const data = Object.assign(
    {},
    query.data
      ? {
          data: JSON.stringify(query.data)
        }
      : {}
  );
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set(
        Object.assign(
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            Language: getLang()
          },
          withAuth
            ? {
                Auth: window.localStorage.getItem('auth')
              }
            : {}
        )
      )
      .query(Object.assign(query, data))
      .end((err, res) => {
        handle(err, res, resolve, reject);
      });
  });
};

const post = function(url, body, withAuth, options) {
  const data = Object.assign(
    {},
    body.data
      ? {
          data: JSON.stringify(body.data)
        }
      : {}
  );
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set(
        Object.assign(
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            Language: getLang()
          },
          withAuth
            ? {
                Auth: window.localStorage.getItem('auth')
              }
            : {}
        )
      )
      .send(Object.assign(body, data))
      .end((err, res) => {
        handle(err, res, resolve, reject);
      });
  });
};

const getJSON = function(url) {
  return new Promise((resolve, reject) => {
    superagent.get(url).end((err, res) => {
      if (!err && res.body) {
        resolve(res.body);
      } else {
        reject();
      }
    });
  });
};

export { get, post, getJSON };
export default { get, post, getJSON };
