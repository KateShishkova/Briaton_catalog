window.addEventListener('DOMContentLoaded', async () => {

  if (document.querySelector('.catalog')) {
    const module = await import('./pages/CatalogPage.js');
    const CatalogPage = module.CatalogPage;
    const page = new CatalogPage();
    await page.init();
  }

});

