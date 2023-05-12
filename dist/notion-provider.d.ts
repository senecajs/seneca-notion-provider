type NotionProviderOptions = {
    api: any;
    debug?: boolean;
};
declare function NotionProvider(this: any, options: NotionProviderOptions): {
    exports: {
        sdk: () => any;
    };
};
export default NotionProvider;
