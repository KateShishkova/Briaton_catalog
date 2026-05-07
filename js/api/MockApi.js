export class MockApi {

  static async getProducts() {
    const response = await fetch('./data/data.json');

    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  static async postUserFeedback(formData) {
    const response = await fetch('https://echo.hoppscotch.io', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}
