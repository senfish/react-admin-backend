import axios from 'axios';
import { count } from 'console';

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
        '__tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227399513997072696884%2522%252C%2522user_unique_id%2522%253A%25227399513997072696884%2522%252C%2522timestamp%2522%253A1722833632366%257D; n_mh=2GMPnUINTp7gpiqQAWfKtz091c80cVK6i5owvYvqsh0; is_staff_user=false; store-region=cn-zj; store-region-src=uid; _ga=GA1.2.926081586.1722834774; passport_csrf_token=6353b3800aa56b9ade6b60ba354a05ab; passport_csrf_token_default=6353b3800aa56b9ade6b60ba354a05ab; _ga_S695FMNGPJ=GS1.2.1732113030.3.0.1732113030.60.0.0; _tea_utm_cache_2018={%22utm_source%22:%22gold_browser_extension%22}; _tea_utm_cache_2608={%22utm_source%22:%22gold_browser_extension%22}; csrf_session_id=bf39dc81492775fd58c02471a699278f; sid_guard=6241af86962ef021f6a078c623b60956%7C1732711952%7C21600%7CWed%2C+27-Nov-2024+18%3A52%3A32+GMT; uid_tt=750e1518a1f8d67362ae6bb75f68bf6a; uid_tt_ss=750e1518a1f8d67362ae6bb75f68bf6a; sid_tt=6241af86962ef021f6a078c623b60956; sessionid=6241af86962ef021f6a078c623b60956; sessionid_ss=6241af86962ef021f6a078c623b60956; sid_ucp_v1=1.0.0-KDU3OTAxODJmY2YxNjNkMjMxNjlmMGNkOWFkNTA4N2E2ZTM5ZWFmNTMKCRCQrJy6BhiwFBoCbGYiIDYyNDFhZjg2OTYyZWYwMjFmNmEwNzhjNjIzYjYwOTU2; ssid_ucp_v1=1.0.0-KDU3OTAxODJmY2YxNjNkMjMxNjlmMGNkOWFkNTA4N2E2ZTM5ZWFmNTMKCRCQrJy6BhiwFBoCbGYiIDYyNDFhZjg2OTYyZWYwMjFmNmEwNzhjNjIzYjYwOTU2',
    },
  });
};
export const requestArticle = async (data) => {
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
  console.log('temp', temp.length);
  return {
    data: temp,
    cursor,
    count: temp.length,
  };
  // return {
  //   data: temp,
  //   cursor,
  //   count: temp.length,
  // };
  // const res = await axios({
  //   url: 'https://api.juejin.cn/content_api/v1/article/query_list',
  //   method: 'post',
  //   data: {
  //     sort_type: 2,
  //     user_id: '3861140569077950',
  //     ...data,
  //   },
  // });
  // return res.data;
};
