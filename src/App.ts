import { startPage } from './pages/startPage.ts';

export function initApp(): void {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('App not found');
    }

    const page = startPage();

    app.appendChild(page.node);

    return;
}
