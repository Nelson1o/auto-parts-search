import axios from "axios";

const BASE_URL = "http://api.favorit-parts.ru/hs/hsprice/";
const EXAMPLE_KEY = "00000000-0000-0000-0000-000000000001";

function getApiKey() {
  const key = import.meta.env.VITE_FAVORIT_KEY || EXAMPLE_KEY;

  if (!key) {
    throw new Error(
      "Не задан ключ API. Создайте .env в корне проекта и укажите VITE_FAVORIT_KEY"
    );
  }

  return key;
}

async function request(params) {
  const key = getApiKey();

  let data;
  try {
    const response = await axios.get(BASE_URL, {
      params: { key, ...params },
      timeout: 10_000,
    });
    data = response.data;
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Превышено время ожидания ответа сервера", {
        cause: err,
      });
    }

    if (err.response) {
      throw new Error(
        `Сервер вернул ошибку: ${err.response.status} ${err.response.statusText}`,
        { cause: err }
      );
    }

    if (err.request) {
      throw new Error(
        "Не удалось связаться с сервером. Проверьте подключение к интернету.",
        { cause: err }
      );
    }

    throw err;
  }

  if (data?.error) {
    const message = Array.isArray(data.error)
      ? data.error.join("; ")
      : String(data.error);
    throw new Error(message);
  }

  const goods = Array.isArray(data?.goods) ? data.goods : [];

  return goods.filter(
    (g) => g && typeof g === "object" && Object.keys(g).length > 0
  );
}

export async function searchByNumber(number) {
  const clean = String(number ?? "").trim();

  if (!clean) {
    throw new Error("Введите артикул");
  }

  return request({ number: clean, info: "on" });
}

export async function searchAnalogues(number, brand) {
  const cleanNumber = String(number ?? "").trim();
  const cleanBrand = String(brand ?? "").trim();

  if (!cleanNumber) {
    throw new Error("Введите артикул");
  }

  if (!cleanBrand) {
    throw new Error("Не выбран производитель");
  }

  return request({
    number: cleanNumber,
    brand: cleanBrand,
    analogues: "on",
    info: "on",
  });
}
