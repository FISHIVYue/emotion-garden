import { expect, test } from '@playwright/test'

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1440, height: 900 },
]

const plantState = {
  questionnaireCompleted: true,
  plantId: 'silver-fern',
  answers: [],
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem('emotion-garden:state:v1', JSON.stringify(state))
  }, plantState)
})

test('hero plant stays contained on garden and match pages', async ({ page }) => {
  test.setTimeout(60_000)
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    for (const route of ['/garden', '/plant-match']) {
      await page.goto(route)
      const variant = route === '/garden' ? 'hero' : 'result'
      const hero = page.locator(`.plant-art--variant-${variant}`)
      const image = hero.locator('img')
      await expect(hero).toBeVisible()
      await expect(image).toHaveAttribute('src', '/assets/plants/plant-hero.png')
      const metrics = await image.evaluate((element) => {
        const image = element as HTMLImageElement
        const rect = image.getBoundingClientRect()
        const shell = document.querySelector<HTMLElement>('.app-shell')!.getBoundingClientRect()
        const nav = document.querySelector<HTMLElement>('.bottom-nav')?.getBoundingClientRect()
        return {
          natural: [image.naturalWidth, image.naturalHeight],
          objectFit: getComputedStyle(image).objectFit,
          rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          shell: { left: shell.left, right: shell.right },
          navTop: nav?.top ?? window.innerHeight,
          documentWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
        }
      })
      expect(metrics.natural).toEqual([673, 1058])
      expect(metrics.objectFit).toBe('contain')
      expect(metrics.rect.left).toBeGreaterThanOrEqual(metrics.shell.left - 1)
      expect(metrics.rect.right).toBeLessThanOrEqual(metrics.shell.right + 1)
      expect(metrics.rect.top).toBeGreaterThanOrEqual(0)
      expect(metrics.rect.bottom).toBeLessThanOrEqual(metrics.navTop + 1)
      expect(metrics.documentWidth[1]).toBe(metrics.documentWidth[0])
    }
  }
})

test('all plant states reuse the same hero asset with state layers', async ({ page }) => {
  const states = ['calm', 'bright', 'tired', 'anxious', 'rainy', 'stormy', 'foggy', 'mixed']
  await page.setViewportSize({ width: 390, height: 844 })

  for (const state of states) {
    await page.goto(`/garden?previewState=${state}`)
    const hero = page.locator(`.plant-art--variant-hero.plant-art--state-${state}`)
    await expect(hero).toBeVisible()
    await expect(hero.locator('img')).toHaveAttribute('src', '/assets/plants/plant-hero.png')
    if (state === 'bright') {
      await expect(hero.locator('.plant-art__new-sprout')).toHaveCount(0)
      const brightVisual = await hero.evaluate((element) => ({
        imageFilter: getComputedStyle(element.querySelector('img')!).filter,
        haloBackground: getComputedStyle(element.querySelector('.plant-art__halo')!).backgroundImage,
      }))
      expect(brightVisual.imageFilter).toContain('saturate')
      expect(brightVisual.haloBackground).toContain('radial-gradient')
    }
    if (state === 'foggy') {
      const fogImage = await page.locator('.plant-state-layer--foggy').evaluate((element) => getComputedStyle(element, '::after').backgroundImage)
      expect(fogImage).toContain('overlay-fog-light.png')
    }
  }
})

test('development preview does not persist and invalid values are ignored', async ({ page }) => {
  await page.goto('/garden')
  await page.evaluate(() => {
    localStorage.setItem('emotion-garden:emotions:v1', JSON.stringify({
      version: 1,
      entries: [{
        id: 'real-rainy-state',
        createdAt: '2026-07-18T08:00:00.000Z',
        weather: 'rain', emotions: [], intensity: 3, note: '', triggers: [], bodySignals: [], needs: [], plantState: 'rainy',
      }],
    }))
  })

  await page.goto('/garden?previewState=bright')
  await expect(page.locator('.plant-art--state-bright')).toBeVisible()
  await page.goto('/garden')
  await expect(page.locator('.plant-art--state-rainy')).toBeVisible()
  await page.goto('/garden?previewState=wilted')
  await expect(page.locator('.plant-art--state-rainy')).toBeVisible()

  const storedState = await page.evaluate(() => JSON.parse(localStorage.getItem('emotion-garden:emotions:v1')!).entries[0].plantState)
  expect(storedState).toBe('rainy')
})
