export function initApp(): void {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('App not found');
    }

    return;
}
