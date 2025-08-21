import { Builder, By, until } from 'selenium-webdriver'
import edge from 'selenium-webdriver/edge.js'
import os from 'node:os'
import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'
const ROUTE = '/dangnhap'
const service = new edge.ServiceBuilder(path.resolve('./msedgedriver.exe'))
const options = new edge.Options().addArguments('--headless=new')

const ART = path.join(os.tmpdir(), 'e2e-artifacts') // ✅ ghi vào thư mục tạm, tránh Vite HMR

async function saveArtifacts(driver, name='login-fail') {
  try {
    await fs.mkdir(ART, { recursive: true })
    await fs.writeFile(path.join(ART, `${name}.html`), await driver.getPageSource())
    await fs.writeFile(path.join(ART, `${name}.png`), await driver.takeScreenshot(), 'base64')
    console.error('URL:', await driver.getCurrentUrl(), '| TITLE:', await driver.getTitle())
    console.error('Artifacts:', ART)
  } catch {}
}

// Click an toàn: scroll → chờ visible+enabled → thử click, nếu bị chặn thì JS click
async function clickSafe(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center", inline:"center"});', el)
  await driver.wait(until.elementIsVisible(el), 5000)
  await driver.wait(until.elementIsEnabled(el), 5000)
  try {
    await el.click()
  } catch (e) {
    // Thử lần 2 bằng JS click nếu bị intercept
    await driver.executeScript('arguments[0].click();', el)
  }
}

// Thử đóng overlay phổ biến (SweetAlert2, cookie banner, backdrop Bootstrap)
async function tryCloseOverlays(driver) {
  const selectors = [
    '.swal2-container .swal2-confirm',
    '.swal2-container .swal2-close',
    '.modal.show .btn-close',
    '.modal-backdrop',
    '.cookie-accept, .cookie-btn, .accept-cookies'
  ]
  for (const sel of selectors) {
    const els = await driver.findElements(By.css(sel))
    if (els.length) {
      try { await clickSafe(driver, els[0]) } catch {}
    }
  }
}

async function waitReady(driver, timeout = 15000) {
  await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', timeout)
}

async function run() {
  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeService(service)
    .setEdgeOptions(options)
    .build()

  try {
    await driver.get(BASE_URL + ROUTE)
    await waitReady(driver)

    // Username (dựa vào placeholder của bạn)
    const username = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Nhập email hoặc số điện thoại']")),
      10000
    )
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', username)
    await username.clear()
    await username.sendKeys('user')

    // Password
    const password = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Nhập mật khẩu' or @type='password']")),
      10000
    )
    await password.clear()
    await password.sendKeys('123456')

    // Submit
    let submit = await driver.wait(
      until.elementLocated(By.xpath("//form//button[@type='submit' or contains(., 'Đăng nhập')]")),
      10000
    )

    // Thử đóng overlay nếu có
    await tryCloseOverlays(driver)

    // Click an toàn
    await clickSafe(driver, submit)

    // Chờ kết quả login (storage hoặc điều hướng)
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl()
      const hasLocal = await driver.executeScript('return !!localStorage.getItem("user")')
      const hasSession = await driver.executeScript('return !!sessionStorage.getItem("user")')
      return hasLocal || hasSession || url.includes('/admin') || url === BASE_URL + '/'
    }, 15000)

    console.log('✅ Login OK:', await driver.getCurrentUrl())
  } catch (e) {
    await saveArtifacts(driver)
    throw e
  } finally {
    await driver.quit()
  }
}

run().catch((e) => { console.error('❌ Test fail:', e); process.exit(1) })
