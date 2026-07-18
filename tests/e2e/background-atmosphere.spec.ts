import { expect, test } from '@playwright/test'

const appBackgroundRoutes = ['/', '/questionnaire', '/plant-match', '/garden', '/timeline', '/profile']

test('routes use the intended background and independent fog layer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const route of appBackgroundRoutes) {
    await page.goto(route)
    const atmosphere = await page.evaluate(() => {
      const image = document.querySelector<HTMLElement>('.ambient__image')!
      const fog = document.querySelector<HTMLElement>('.ambient__fog-image')!
      return {
        image: getComputedStyle(image).backgroundImage,
        imageSize: getComputedStyle(image).backgroundSize,
        fog: getComputedStyle(fog).backgroundImage,
        fogOpacity: Number(getComputedStyle(fog).opacity),
      }
    })
    expect(atmosphere.image).toContain('bg-app-botanical.webp')
    expect(atmosphere.imageSize).toBe('cover')
    expect(atmosphere.fog).toContain('overlay-fog-light.png')
    expect(atmosphere.fogOpacity).toBeLessThanOrEqual(0.52)
  }

  await page.goto('/forest')
  const forestImage = await page.locator('.ambient__image').evaluate((element) => getComputedStyle(element).backgroundImage)
  expect(forestImage).toContain('bg-forest-mist.webp')
})

test('background layers preserve shell geometry without horizontal overflow', async ({ page }) => {
  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 1440, height: 900 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    for (const route of ['/timeline', '/forest']) {
      await page.goto(route)
      const metrics = await page.evaluate(() => {
        const root = document.documentElement
        const shell = document.querySelector<HTMLElement>('.app-shell')!
        const ambient = document.querySelector<HTMLElement>('.ambient')!
        const shellRect = shell.getBoundingClientRect()
        const ambientRect = ambient.getBoundingClientRect()
        return {
          documentWidth: [root.clientWidth, root.scrollWidth],
          shell: { width: shellRect.width, height: shellRect.height, x: shellRect.x },
          ambient: { width: ambientRect.width, left: ambientRect.left, right: ambientRect.right },
        }
      })
      expect(metrics.documentWidth[1]).toBe(metrics.documentWidth[0])
      expect(metrics.ambient.width).toBeLessThanOrEqual(480)
      expect(metrics.ambient.left).toBeGreaterThanOrEqual(metrics.shell.x - 1)
      expect(metrics.ambient.right).toBeLessThanOrEqual(metrics.shell.x + metrics.shell.width + 1)
      expect(metrics.shell.height).toBe(viewport.height)
    }
  }
})
