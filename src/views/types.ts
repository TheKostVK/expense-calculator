/**
 * Ключ монтирования (идентификатор слота/элемента в MainView).
 */
export type MountKey = string;

/**
 * Контракт MainView:
 * - Можно монтировать/размонтировать как весь контент, так и элементы по ключу.
 * - Если ключ не указан: операции выполняются над всем контейнером целиком.
 */
export interface IMainView {
    mount(child: HTMLElement, key?: MountKey): void;
    unmount(key?: MountKey): boolean;
    addChild(child: HTMLElement): void;
    addChildWithKey(key: MountKey, child: HTMLElement): () => boolean;
    hasKey(key: MountKey): boolean;
}
