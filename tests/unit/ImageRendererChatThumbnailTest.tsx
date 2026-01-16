import {act, cleanup, render} from '@testing-library/react-native';
import React from 'react';
import {AttachmentContext} from '@components/AttachmentContext';
import CONST from '@src/CONST';
import ImageRenderer from '../../src/components/HTMLEngineProvider/HTMLRenderers/ImageRenderer';

type ThumbnailImageMockProps = {
    previewSourceURL: string;
    shouldDynamicallyResize?: boolean;
    objectPosition?: string;
    onLoadFailure?: () => void;
};

let latestThumbnailImageProps: ThumbnailImageMockProps | undefined;

jest.mock('@components/ThumbnailImage', () => {
    const ReactMock = require('react') as typeof React;
    return (props: ThumbnailImageMockProps) => {
        latestThumbnailImageProps = props;
        return ReactMock.createElement(ReactMock.Fragment, null);
    };
});

jest.mock('@hooks/useThemeStyles', () =>
    jest.fn(() => ({
        webViewStyles: {tagStyles: {img: {}}},
        noOutline: {},
    })),
);

jest.mock('@hooks/useTheme', () =>
    jest.fn(() => ({
        highlightBG: '#fff',
        border: '#000',
    })),
);

jest.mock('@hooks/useLocalize', () =>
    jest.fn(() => ({
        translate: (key: string) => key,
    })),
);

jest.mock('@hooks/useOnyx', () => jest.fn(() => []));

jest.mock('@hooks/useLazyAsset', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    useMemoizedLazyExpensifyIcons: () => ({Document: 'Document', GalleryNotFound: 'GalleryNotFound'}),
}));

describe('ImageRenderer chat attachment thumbnails', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        latestThumbnailImageProps = undefined;
    });

    it('prefers the original source for extremely tall images to avoid blurry stretched previews', () => {
        const original = 'https://example.com/receipts/w_foo.jpg';
        const preview320 = 'https://example.com/receipts/w_foo.jpg.320.jpg';

        render(
            <AttachmentContext.Provider value={{type: CONST.ATTACHMENT_TYPE.REPORT}}>
                <ImageRenderer
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tnode={
                        {
                            attributes: {
                                src: preview320,
                                [CONST.ATTACHMENT_SOURCE_ATTRIBUTE]: original,
                                'data-expensify-width': '864',
                                'data-expensify-height': '24174',
                                'data-expensify-preview-modal-disabled': 'true',
                            },
                        } as any
                    }
                />
            </AttachmentContext.Provider>,
        );

        expect(latestThumbnailImageProps?.previewSourceURL).toBe(original);
        expect(latestThumbnailImageProps?.previewSourceURL).not.toContain('.4096.jpg');
        expect(latestThumbnailImageProps?.shouldDynamicallyResize).toBe(false);
        expect(latestThumbnailImageProps?.objectPosition).toBe(CONST.IMAGE_OBJECT_POSITION.TOP);
    });

    it('falls back to the 1024 preview when the original source fails to load', async () => {
        const original = 'https://example.com/receipts/w_foo.jpg';
        const preview320 = 'https://example.com/receipts/w_foo.jpg.320.jpg';
        const preview1024 = 'https://example.com/receipts/w_foo.jpg.1024.jpg';

        render(
            <AttachmentContext.Provider value={{type: CONST.ATTACHMENT_TYPE.REPORT}}>
                <ImageRenderer
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tnode={
                        {
                            attributes: {
                                src: preview320,
                                [CONST.ATTACHMENT_SOURCE_ATTRIBUTE]: original,
                                'data-expensify-width': '864',
                                'data-expensify-height': '24174',
                                'data-expensify-preview-modal-disabled': 'true',
                            },
                        } as any
                    }
                />
            </AttachmentContext.Provider>,
        );

        expect(latestThumbnailImageProps?.previewSourceURL).toBe(original);

        await act(async () => {
            latestThumbnailImageProps?.onLoadFailure?.();
        });

        expect(latestThumbnailImageProps?.previewSourceURL).toBe(preview1024);
    });

    it('uses the 1024 preview for normal aspect ratio images in chat', () => {
        const original = 'https://example.com/chat-attachments/w_bar.jpg';
        const preview320 = 'https://example.com/chat-attachments/w_bar.jpg.320.jpg';
        const preview1024 = 'https://example.com/chat-attachments/w_bar.jpg.1024.jpg';

        render(
            <AttachmentContext.Provider value={{type: CONST.ATTACHMENT_TYPE.REPORT}}>
                <ImageRenderer
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tnode={
                        {
                            attributes: {
                                src: preview320,
                                [CONST.ATTACHMENT_SOURCE_ATTRIBUTE]: original,
                                'data-expensify-width': '2000',
                                'data-expensify-height': '1000',
                                'data-expensify-preview-modal-disabled': 'true',
                            },
                        } as any
                    }
                />
            </AttachmentContext.Provider>,
        );

        expect(latestThumbnailImageProps?.previewSourceURL).toBe(preview1024);
        expect(latestThumbnailImageProps?.shouldDynamicallyResize).toBe(false);
        expect(latestThumbnailImageProps?.objectPosition).toBe(CONST.IMAGE_OBJECT_POSITION.INITIAL);
    });
});

