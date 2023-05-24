type NotionProviderOptions = {
    api: any;
    headers: any;
    debug?: boolean;
};
declare function NotionProvider(this: any, options: NotionProviderOptions): {
    exports: {
        sdk: () => any;
    };
};
export default NotionProvider;
