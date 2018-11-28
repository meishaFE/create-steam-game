import { isType } from './type';
const GAME_NAME_REG = /\/game\/(.*)\//;

/**
 * 根据当前游戏路由获取语言设置
 * @param {Boolean} isDefaultEn 是否默认为英文
 * @returns {String} gameLanguage 游戏语言 'cn'|'en'
 */
function getLang(isDefaultEn = false) {
  try {
    const m = window.location.href.match(GAME_NAME_REG);
    const gameName = m ? m[1] : '';
    const lang = localStorage.getItem('lang')
      ? JSON.parse(localStorage.getItem('lang'))
      : {};
    let str = 'cn';

    str = isDefaultEn ? 'en' : lang[gameName];

    return str;
  } catch (error) {
    return 'cn';
  }
}

/**
 * 设置 localStorage 的语言
 * @param {String} gameName 游戏名
 * @param {Sring} lang 语言
 */
function setLang(gameName, lang) {
  try {
    const temp = localStorage.getItem('lang')
      ? JSON.parse(localStorage.getItem('lang'))
      : {};
    temp[gameName] = lang;
    localStorage.setItem('lang', JSON.stringify(temp));
  } catch (error) {
    console.error(error);
  }
}

/**
 * 设置所有游戏的语言
 * @param {Object} gameLangs  服务器返回的语言设置
 * @param {Array} hadEnVersionGameMap 拥有英文的游戏数组
 * @param {Array} gameIdFileMap 游戏的 idMap
 * @returns {Object} {local, server} 语言设置
 */
function setAllGameLangToLocal(
  gameLangs,
  hadEnVersionGameMap = [],
  gameIdFileMap = []
) {
  if (!gameLangs) return;
  try {
    const langs = Object.keys(gameLangs).reduce((obj, key) => {
      obj[gameIdFileMap[key] || key] = gameLangs[key];
      return obj;
    }, {});
    const localLangs = localStorage.getItem('lang')
      ? JSON.parse(localStorage.getItem('lang'))
      : {};
    Object.keys(langs).forEach(key => {
      const localLang = localLangs[key];
      const serverLang = langs[key];
      const serverLangHadEn = serverLang.some(l => l === 'en');
      const serverLangHadCn = serverLang.some(l => l === 'zh-cn');
      const isGameHadEn = !!~hadEnVersionGameMap.indexOf(key);
      if (!localLang || isType(localLang, 'Array')) {
        // 没设置本地语言
        localLangs[key] = serverLangHadEn && isGameHadEn ? 'en' : 'cn';
      } else if (localLang === 'cn' && !serverLangHadCn) {
        // 游戏设置为中文，但是服务器设置没有中文
        localLangs[key] = 'en';
      } else if (localLang === 'en' && !serverLangHadEn) {
        // 游戏设置为英文，但是服务器设置没有英文
        localLangs[key] = 'cn';
      }
    });
    localStorage.setItem('lang', JSON.stringify(localLangs));
    return {
      local: localLangs,
      server: langs
    };
  } catch (error) {
    console.error(error);
    return {
      local: 'cn',
      server: 'cn'
    };
  }
}

/**
 * 单独设置某个游戏的语言
 * @param {Object} serverGameLangs 服务器返回的语言设置
 * @param {String} gameName 该游戏的 name
 * @param {Boolean} isGameHadEn 当前游戏是否有英文版本
 * @returns {Object} {local, server} 语言设置
 */
function setGameLangToLocal(
  serverGameLangs,
  gameFrontId,
  gameServerId,
  isGameHadEn = false
) {
  try {
    if (!serverGameLangs || !gameFrontId || !gameServerId) return;

    const localGameLangs = localStorage.getItem('lang')
      ? JSON.parse(localStorage.getItem('lang'))
      : {};
    const serverLang = serverGameLangs[gameServerId];
    const localLang = localGameLangs[gameFrontId];
    const serverLangHadEn = serverLang.some(l => l === 'en');
    const serverLangHadCn = serverLang.some(l => l === 'zh-cn');

    if (!localLang || isType(localLang, 'Array')) {
      // 没设置本地语言
      localGameLangs[gameFrontId] =
        serverLangHadEn && isGameHadEn ? 'en' : 'cn';
    } else if (localLang === 'cn' && !serverLangHadCn) {
      // 游戏设置为中文，但是服务器设置没有中文
      localGameLangs[gameFrontId] = 'en';
    } else if (localLang === 'en' && !serverLangHadEn) {
      // 游戏设置为英文，但是服务器设置没有英文
      localGameLangs[gameFrontId] = 'cn';
    }

    localStorage.setItem('lang', JSON.stringify(localGameLangs));
    return {
      local: localLang,
      server: serverLang
    };
  } catch (error) {
    console.error(error);
    return {
      local: 'cn',
      server: 'cn'
    };
  }
}

export { getLang, setLang, setAllGameLangToLocal, setGameLangToLocal };
