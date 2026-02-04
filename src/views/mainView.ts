import { IMainView } from './types.ts';

export class MainView implements IMainView {
    private mainNode: HTMLElement | null = document.getElementById('app');
    private node: HTMLElement | null = null;

    constructor() {
        if (!this.mainNode) {
            throw new Error('App root element #app not found');
        }

        const page = document.createElement('div');
        page.classList.add('page');

        const main = document.createElement('section');
        main.classList.add('main');

        page.appendChild(main);
        this.node = main;
        this.mainNode.appendChild(page);
    }

    mount() {
        if (this.node) {
            this.mainNode!.appendChild(this.node);
        }
    }

    unmount() {
        this.node!.replaceChildren();
    }

    update(children: HTMLElement) {
        this.node!.replaceChildren();
        this.node!.appendChild(children);
    }

    addChild(children: HTMLElement) {
        this.node!.appendChild(children);
    }
}
