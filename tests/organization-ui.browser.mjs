// Playwright MCP browser_run_code_unsafe filename: tests/organization-ui.browser.mjs
// Isolated local fixture only; no browser dependency is added to the application.
async (page) => {
  const assert = {
    ok(value) { if (!value) throw new Error('UI assertion failed'); },
    equal(actual, expected) { if (actual !== expected) throw new Error(`Expected ${String(expected)}, got ${String(actual)}`); },
  };
  const baseURL = 'http://127.0.0.1:5187';
  const email = 'ui-review@example.test';
  const password = 'review-only-password';
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname));
  await page.unroute('**/api/users');
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('button', { name: 'Entrar na minha conta', exact: true }).or(page.getByRole('heading', { name: 'Equipe do evento', exact: true })).waitFor();
  if (await page.getByRole('button', { name: 'Entrar na minha conta', exact: true }).isVisible()) {
    await page.getByLabel('E-mail', { exact: true }).fill(email);
    await page.getByLabel('Senha', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Entrar na minha conta', exact: true }).click();
  }
  await page.getByRole('heading', { name: 'Equipe do evento', exact: true }).waitFor();
  const trigger = page.getByRole('button', { name: 'Adicionar moderador', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Adicionar moderador', exact: true });
  await dialog.waitFor();
  assert.equal(await dialog.getByLabel('Nome', { exact: true }).count(), 1);
  assert.equal(await dialog.getByLabel('Senha temporária', { exact: true }).count(), 1);
  for (const size of [{ width: 390, height: 667 }, { width: 902, height: 482 }]) {
    await page.setViewportSize(size);
    const bounds = await dialog.boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= size.width && bounds.y + bounds.height <= size.height);
    assert.equal(await dialog.evaluate((element) => element.scrollWidth > element.clientWidth), false);
    for (const key of ['Tab', 'Shift+Tab']) {
      for (let index = 0; index < 9; index++) {
        await page.keyboard.press(key);
        assert.equal(await page.evaluate(() => !!document.activeElement?.closest('dialog[open]')), true);
      }
    }
  }
  await page.keyboard.press('Escape');
  assert.equal(await dialog.isVisible(), false);
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
  await page.getByRole('button', { name: 'Ranking', exact: true }).click();
  await page.getByLabel('Sala', { exact: true }).selectOption('MDX26');
  await page.getByRole('button', { name: 'Atualizar', exact: true }).waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

  await page.goto(`${baseURL}/tv?room=MDX26`);
  const moderation = page.getByRole('button', { name: 'Abrir moderação da sala MDX26', exact: true });
  await moderation.click();
  const controls = page.getByRole('dialog', { name: 'Moderação · MDX26', exact: true });
  await controls.getByRole('button', { name: /^(Fechar entradas · manter rodada|Reabrir entradas)$/ }).waitFor();
  assert.equal(await controls.getByLabel('Transferir responsabilidade', { exact: true }).count(), 0);
  assert.equal(await page.getByRole('banner').getByRole('button', { name: /modera/i }).count(), 0);
  const maintenance = controls.locator('details').filter({ has: page.locator('summary', { hasText: 'Cancelar rodada ou zerar ranking' }) });
  assert.equal(await maintenance.getAttribute('open'), null);
  await controls.getByRole('button', { name: /Participantes/ }).click();
  assert.equal(await controls.getByText('Remover alguém impede seu retorno nesta rodada.', { exact: false }).isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await moderation.evaluate((element) => element === document.activeElement), true);
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('button', { name: 'Sair da conta', exact: true }).click();
  await page.getByLabel('E-mail', { exact: true }).fill('ana@example.test');
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar na minha conta', exact: true }).click();
  await page.getByRole('heading', { name: 'Ranking por sala', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Equipe', exact: true }).count(), 0);
  await page.getByLabel('Sala', { exact: true }).selectOption('MDX26');
  assert.equal(await page.getByLabel('Sala', { exact: true }).getByRole('option', { name: 'Todas as salas — manutenção global', exact: true }).count(), 0);
  for (const code of ['MDX26', 'PALCO2']) {
    await page.goto(`${baseURL}/tv?room=${code}`);
    await page.getByRole('button', { name: `Abrir moderação da sala ${code}`, exact: true }).click();
    const roomControls = page.getByRole('dialog', { name: `Moderação · ${code}`, exact: true });
    await roomControls.getByRole('button', { name: /^(Fechar entradas · manter rodada|Reabrir entradas)$/ }).waitFor();
    assert.equal(await roomControls.getByText('Qualquer conta da organização pode moderar esta sala.', { exact: true }).isVisible(), true);
    assert.equal(await roomControls.getByRole('combobox').count(), 0);
    await page.keyboard.press('Escape');
  }
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('heading', { name: 'Ranking por sala', exact: true }).waitFor();
  const tv = await page.context().newPage();
  const player = await page.context().newPage();
  try {
    await tv.goto(`${baseURL}/tv?room=MDX26`);
    await tv.getByRole('button', { name: 'Abrir moderação da sala MDX26', exact: true }).waitFor();
    await player.goto(`${baseURL}/play?room=MDX26`);
    await player.waitForFunction(() => document.querySelector('main'));
    for (const code of ['MDX26', 'PALCO2']) {
      await page.getByLabel('Sala', { exact: true }).selectOption(code);
      const remove = page.getByRole('button', { name: 'Excluir sala e dados…', exact: true });
      await remove.waitFor();
      await page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent.includes('Excluir sala e dados'))?.disabled);
      await remove.click();
      const confirmation = page.getByRole('dialog', { name: `Excluir sala ${code}?`, exact: true });
      const submit = confirmation.getByRole('button', { name: 'Excluir sala permanentemente', exact: true });
      assert.equal(await submit.isDisabled(), true);
      await confirmation.getByLabel(`Digite ${code} para confirmar`, { exact: true }).fill(code.toLowerCase());
      assert.equal(await submit.isDisabled(), true);
      await confirmation.getByLabel(`Digite ${code} para confirmar`, { exact: true }).fill(code);
      assert.equal(await submit.isEnabled(), true);
      await submit.click();
      await confirmation.waitFor({ state: 'hidden' });
      assert.equal(await page.getByLabel('Sala', { exact: true }).locator(`option[value="${code}"]`).count(), 0);
      if (code === 'MDX26') {
        await tv.waitForURL(`${baseURL}/`);
        await player.waitForURL(`${baseURL}/`);
      }
    }
    await page.getByText('Nenhuma sala cadastrada.', { exact: false }).waitFor();
    await page.goto(baseURL);
    await page.getByText('Nenhuma sala encontrada. A organização pode criar a primeira sala.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('link', { name: /Abrir telão/ }).count(), 0);
    await page.getByRole('button', { name: 'Criar sala de TV', exact: true }).click();
    const create = page.getByRole('dialog', { name: 'Criar sala de TV', exact: true });
    await create.getByLabel('Nome da sala', { exact: true }).fill('Nova arena');
    await create.getByLabel('Código da sala', { exact: true }).fill('MDX26');
    await create.getByRole('button', { name: 'Criar e abrir telão', exact: true }).click();
    await page.getByRole('button', { name: 'Abrir moderação da sala MDX26', exact: true }).waitFor();
  } finally { await tv.close(); await player.close(); }
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('button', { name: 'Sair da conta', exact: true }).click();
  return { checks: ['login', 'section navigation', 'field labels', 'mobile and short viewport', 'dialog focus containment', 'Escape and focus return', 'ranking scope', 'progressive disclosure', 'participant controls', 'no room-owner controls', 'staff moderates all rooms', 'no user or global maintenance controls for staff', 'moderation only in QR card', 'moderator deletes main and last room', 'exact typed confirmation', 'TV and player redirect', 'empty admin and home', 'recreate after deleting all rooms'] };
}
