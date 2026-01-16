import {act, cleanup, render} from '@testing-library/react-native';
import React from 'react';
import AttachmentView from '../../src/components/Attachments/AttachmentView';

type AttachmentViewImageMockProps = {
    url: string;
};

let latestAttachmentViewImageProps: AttachmentViewImageMockProps | undefined;

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

jest.mock('../../src/components/Attachments/AttachmentView/AttachmentViewImage', () => {
    const ReactMock = require('react') as typeof React;
    return (props: AttachmentViewImageMockProps) => {
        latestAttachmentViewImageProps = props;
        return ReactMock.createElement(ReactMock.Fragment, null);
    };
});

jest.mock('../../src/components/Attachments/AttachmentView/HighResolutionInfo', () => {
    const ReactMock = require('react') as typeof React;
    return () => ReactMock.createElement(ReactMock.Fragment, null);
});

jest.mock('@hooks/useOnyx', () => jest.fn(() => [undefined]));

jest.mock('@hooks/useFirstRenderRoute', () =>
    jest.fn(() => ({
        isFocused: false,
    })),
);

jest.mock('@components/VideoPlayerContexts/PlaybackContext', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    usePlaybackContext: () => ({
        updateCurrentURLAndReportID: jest.fn(),
        currentlyPlayingURL: undefined,
        playVideo: jest.fn(),
    }),
}));

jest.mock('@hooks/useLocalize', () =>
    jest.fn(() => ({
        translate: (key: string) => key,
    })),
);

jest.mock('@hooks/useNetwork', () =>
    jest.fn(() => ({
        isOffline: false,
    })),
);

jest.mock('@hooks/useSafeAreaPaddings', () =>
    jest.fn(() => ({
        safeAreaPaddingBottomStyle: {},
    })),
);

jest.mock('@hooks/useStyleUtils', () => jest.fn(() => ({})));

jest.mock('@hooks/useTheme', () =>
    jest.fn(() => ({
        icon: '#000',
    })),
);

jest.mock('@hooks/useThemeStyles', () =>
    jest.fn(() => ({
        imageModalImageCenterContainer: {},
        ph10: {},
        flex1: {},
        attachmentCarouselContainer: {},
    })),
);

jest.mock('@hooks/useLazyAsset', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    useMemoizedLazyExpensifyIcons: () => ({ArrowCircleClockwise: 'ArrowCircleClockwise', Gallery: 'Gallery'}),
}));

describe('AttachmentView high resolution images', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        latestAttachmentViewImageProps = undefined;
    });

    it('uses the original source inside the attachment modal (avoids narrow preview for very tall images)', async () => {
        const original = 'https://example.com/receipts/w_receipt.jpg';
        const preview = 'https://example.com/receipts/w_receipt.jpg.1024.jpg';

        render(
            <AttachmentView
                attachmentID="1"
                source={original}
                previewSource={preview}
                isAuthTokenRequired
                isUsedInAttachmentModal
                isUploaded
                file={{name: 'receipt.jpg', width: 864, height: 24174}}
            />,
        );

        await act(async () => {
            await flushPromises();
        });

        expect(latestAttachmentViewImageProps?.url).toBe(original);
    });

    it('uses the preview source outside the attachment modal for high resolution images', async () => {
        const original = 'https://example.com/receipts/w_receipt.jpg';
        const preview = 'https://example.com/receipts/w_receipt.jpg.1024.jpg';

        render(
            <AttachmentView
                attachmentID="1"
                source={original}
                previewSource={preview}
                isAuthTokenRequired
                isUsedInAttachmentModal={false}
                isUploaded
                file={{name: 'receipt.jpg', width: 864, height: 24174}}
            />,
        );

        await act(async () => {
            await flushPromises();
        });

        expect(latestAttachmentViewImageProps?.url).toBe(preview);
    });
});

