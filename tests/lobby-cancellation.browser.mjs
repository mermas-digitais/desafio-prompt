// Run with Playwright MCP browser_run_code_unsafe; isolated test:ui:serve fixture only.
async (page) => {
  const base = 'http://127.0.0.1:5187';
  const assert = (value, message) => { if (!value) throw new Error(message); };
  await page.goto(`${base}/admin`);
  const login = page.getByRole('button', { name: 'Entrar na minha conta', exact: true });
  await login.waitFor();
  await page.getByLabel('E-mail', { exact: true }).fill('ana@example.test');
  await page.getByLabel('Senha', { exact: true }).fill('review-only-password');
  await login.click();
  await page.getByRole('heading', { name: 'Ranking por sala', exact: true }).waitFor();
  const created = await page.evaluate(async () => {
    const response = await fetch('/api/rooms/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomCode: 'LOBBYQA', name: 'Lobby de teste' }) });
    if (!response.ok) throw new Error('Restart the isolated fixture before repeating this test');
    return response.json();
  });
  const token = created.state.roundToken;
  const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 } });
  const participant = await context.newPage();
  try {
    await participant.goto(`${base}/play?room=LOBBYQA&round=${encodeURIComponent(token)}`);
    await participant.getByPlaceholder('Ex: Mermã Cyber, AdaTech...').fill('Lobby Teste');
    await participant.getByRole('button', { name: 'Salvar e Entrar na Rodada', exact: true }).click();
    await page.waitForFunction(async () => (await (await fetch('/api/state?room=LOBBYQA')).json()).phase === 'LOBBY');
    await page.goto(`${base}/tv?room=LOBBYQA`);
    await page.getByRole('button', { name: 'Cancelar partida…', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Confirmar ação · LOBBYQA', exact: true });
    await dialog.waitFor();
    for (const viewport of [{ width: 1366, height: 768 }, { width: 390, height: 667 }]) {
      await page.setViewportSize(viewport);
      const bounds = await dialog.boundingBox();
      assert(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height, 'Dialog exceeds viewport');
      assert(!await dialog.evaluate((element) => element.scrollWidth > element.clientWidth), 'Horizontal dialog overflow');
    }
    await page.screenshot({ path: 'C:/Users/Schneider/AppData/Local/Temp/opencode/lobby-cancellation-mobile.png' });
    await dialog.getByRole('button', { name: 'Cancelar partida', exact: true }).click();
    await participant.getByText('Partida cancelada pela organização.', { exact: false }).waitFor();
    const state = await page.evaluate(async () => (await fetch('/api/state?room=LOBBYQA')).json());
    assert(state.phase === 'IDLE' && state.players.length === 0 && state.roundToken !== token, 'Lobby not cancelled');
    assert(await page.getByRole('button', { name: 'Cancelar partida…', exact: true }).count() === 0, 'Lobby button remains after cancellation');
    const validation = await participant.evaluate(async (round) => (await fetch(`/api/rounds/validate?room=LOBBYQA&round=${encodeURIComponent(round)}`)).json(), token);
    assert(validation.status === 'EXPIRED', 'Old QR remains valid');
    return { checks: ['moderator cancellation', 'desktop and mobile confirmation', 'participant notified and removed', 'old QR expired', 'empty idle room preserved'] };
  } finally { await context.close(); }
}
