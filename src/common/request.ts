import axios from 'axios';

const requestJuejinAriticles = async (data = {}) => {
  return await axios({
    url: 'https://api.juejin.cn/content_api/v1/article/query_list',
    method: 'post',
    data: {
      sort_type: 2,
      user_id: '3861140569077950',
      ...data,
    },
    headers: {
      Origin: 'https://juejin.cn',
      Cookie:
        'store-region=cn-zj; store-region-src=uid; csrf_session_id=21d3891a5dafd6442c954611766393d2; passport_csrf_token=bc557a65ee4e10695d880cc5377b3d17; passport_csrf_token_default=bc557a65ee4e10695d880cc5377b3d17; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25226899478642923390478%2522%252C%2522web_id%2522%253A%25226899478642923390478%2522%252C%2522timestamp%2522%253A1733921614841%257D; _tea_utm_cache_2608={%22utm_source%22:%22gold_browser_extension%22}; _tea_utm_cache_2018={%22utm_source%22:%22gold_browser_extension%22}; sid_guard=3304198f3ce41e5e5bb6792f721443de%7C1733939942%7C21600%7CWed%2C+11-Dec-2024+23%3A59%3A02+GMT; uid_tt=6dadebec046acf02637310910075dd75; uid_tt_ss=6dadebec046acf02637310910075dd75; sid_tt=3304198f3ce41e5e5bb6792f721443de; sessionid=3304198f3ce41e5e5bb6792f721443de; sessionid_ss=3304198f3ce41e5e5bb6792f721443de; is_staff_user=false; sid_ucp_v1=1.0.0-KGM5Mjc4MGFkMTM5ZTYzYzczNzAxYWYyY2ZlNmFhNDMzMjFiNjYxOTYKCRDmpee6BhiwFBoCbHEiIDMzMDQxOThmM2NlNDFlNWU1YmI2NzkyZjcyMTQ0M2Rl; ssid_ucp_v1=1.0.0-KGM5Mjc4MGFkMTM5ZTYzYzczNzAxYWYyY2ZlNmFhNDMzMjFiNjYxOTYKCRDmpee6BhiwFBoCbHEiIDMzMDQxOThmM2NlNDFlNWU1YmI2NzkyZjcyMTQ0M2Rl',
    },
  });
};
export const requestArticle = async () => {
  let hashMore = true;
  let cursor = '0';
  let temp = [];
  while (hashMore) {
    const info = (await requestJuejinAriticles({ cursor })) as unknown as {
      data: {
        has_more: boolean;
        data: unknown[];
        cursor: string;
      };
    };
    temp = temp.concat(info?.data?.data);
    hashMore = info?.data?.has_more;
    cursor = info?.data?.cursor;
  }
  return {
    data: temp,
    cursor,
    count: temp.length,
  };
};
