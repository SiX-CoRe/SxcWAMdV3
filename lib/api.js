/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
import axios from "axios";

const baseURL = (global?.web || "https://api.jerexd.my.id").replace(/\/$/, "");

const api = {
  get(endpoint, config = {}) {
    return axios.get(baseURL + endpoint, {
      ...config
    });
  },

  post(endpoint, data = {}, config = {}) {
    return axios.post(
      baseURL + endpoint,
      data,
      {
        ...config
      }
    );
  }
};

export default api;
