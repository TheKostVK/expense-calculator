import { IMainView, MountKey } from './types.ts';

export class MainView implements IMainView {
    private rootNode: HTMLElement | null = document.getElementById('app');
    private pageNode: HTMLElement;
    private contentNode: HTMLElement;
    private childrenByKey: Map<MountKey, HTMLElement> = new Map();

    constructor() {
        if (!this.rootNode) {
            throw new Error('App root element #app not found');
        }

        this.pageNode = document.createElement('div');
        this.pageNode.classList.add('page');

        this.contentNode = document.createElement('section');
        this.contentNode.classList.add('main');

        this.pageNode.appendChild(this.contentNode);

        this.rootNode.appendChild(this.pageNode);
    }

    /**
     * Монтирует элемент.
     * - Без key: перерисовка контента
     * - С key: монтирование/замена элемента в конкретном слоте key.
     */
    public mount(child: HTMLElement, key?: MountKey): void {
        if (!key) {
            this.contentNode.replaceChildren(child);
            this.childrenByKey.clear();

            return;
        }

        const existing = this.childrenByKey.get(key);

        if (existing) {
            existing.remove();
            this.childrenByKey.delete(key);
        }

        child.dataset.key = key;

        this.childrenByKey.set(key, child);
        this.contentNode.appendChild(child);
    }

    /**
     * Размонтирует элемент
     * - Без key: полностью очищает
     * - С key: удаляет только связанный с key узел
     */
    public unmount(key?: MountKey): boolean {
        if (!key) {
            const hadAny = this.contentNode.childNodes.length > 0;

            this.contentNode.replaceChildren();
            this.childrenByKey.clear();

            return hadAny;
        }

        const el = this.childrenByKey.get(key);

        if (!el) {
            return false;
        }

        el.remove();

        this.childrenByKey.delete(key);

        return true;
    }

    /**
     * Append без ключа
     */
    public addChild(child: HTMLElement): void {
        this.contentNode.appendChild(child);
    }

    /**
     * Добавляет элемент с ключом
     * @returns функция, которая удалит этот элемент по ключу
     */
    public addChildWithKey(key: MountKey, child: HTMLElement): () => boolean {
        this.mount(child, key);

        return () => this.unmount(key);
    }

    public hasKey(key: MountKey): boolean {
        return this.childrenByKey.has(key);
    }
}
