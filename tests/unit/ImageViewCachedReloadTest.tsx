import {act, cleanup, render, screen} from '@testing-library/react-native';
import React from 'react';
import ImageView from '../../src/components/ImageView/index.tsx';

type ImageLoadEvent = {nativeEvent: {width: number; height: number}};
type ImageMockProps = {onLoadStart?: () => void; onLoad?: (event: ImageLoadEvent) => void};
type PressableMockProps = {children?: React.ReactNode};

let latestImageProps: ImageMockProps | undefined;

const mockGetZoomSizingStyle = jest.fn(() => ({}));
const mockGetZoomCursorStyle = jest.fn(() => ({}));

jest.mock('@components/Image', () => {
    const ReactMock = require('react') as typeof React;
    return (props: ImageMockProps) => {
        latestImageProps = props;
        return ReactMock.createElement(ReactMock.Fragment, null);
    };
});

jest.mock('@components/Pressable/PressableWithoutFeedback', () => {
    const ReactMock = require('react') as typeof React;
    return (props: PressableMockProps) => ReactMock.createElement(ReactMock.Fragment, null, props.children);
});

jest.mock('@components/AttachmentOfflineIndicator', () => {
    const ReactMock = require('react') as typeof React;
    return () => ReactMock.createElement(ReactMock.Fragment, null);
});

jest.mock('@components/LoadingIndicator', () => {
    const ReactMock = require('react') as typeof React;
    const {View} = require('react-native') as {View: React.ComponentType<{testID?: string}>};
    return () => ReactMock.createElement(View, {testID: 'ImageViewLoading'});
});

jest.mock('@components/Lightbox', () => {
    const ReactMock = require('react') as typeof React;
    return () => ReactMock.createElement(ReactMock.Fragment, null);
});

jest.mock('@libs/fileDownload/FileUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    isLocalFile: () => false,
}));

jest.mock('@hooks/useNetwork', () => jest.fn(() => ({isOffline: false})));

jest.mock('@hooks/useThemeStyles', () =>
    jest.fn(() => ({
        imageViewContainer: {},
        overflowAuto: {},
        pRelative: {},
        pAbsolute: {},
        flex1: {},
        h100: {},
        w100: {},
        opacity1: {},
        bgTransparent: {},
    })),
);

jest.mock('@hooks/useStyleUtils', () =>
    jest.fn(() => ({
        getZoomSizingStyle: mockGetZoomSizingStyle,
        getZoomCursorStyle: mockGetZoomCursorStyle,
    })),
);

jest.mock('@libs/DeviceCapabilities', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    canUseTouchScreen: () => false,
    hasHoverSupport: () => false,
    hasPassiveEventListenerSupport: () => false,
}));

jest.mock('@libs/DeviceCapabilities/canUseTouchScreen', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: () => false,
}));

describe('ImageView', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        latestImageProps = undefined;
    });

    it('starts zoomed when used in the attachment modal', () => {
        render(
            <ImageView
                url="https://example.com/image.png"
                fileName="image.png"
                isAuthTokenRequired={false}
                isUsedInAttachmentModal
                onError={jest.fn()}
            />,
        );

        expect(mockGetZoomSizingStyle).toHaveBeenCalled();
        expect(mockGetZoomSizingStyle.mock.calls.some(([args]) => args.isZoomed === true)).toBe(true);
    });

    it('resets imageSize when a cached image triggers onLoadStart again', async () => {
        render(
            <ImageView
                url="https://example.com/image.png"
                fileName="image.png"
                isAuthTokenRequired={false}
                onError={jest.fn()}
            />,
        );

        expect(latestImageProps).toBeDefined();
        expect(screen.getByTestId('ImageViewLoading')).toBeOnTheScreen();

        await act(async () => {
            latestImageProps?.onLoad?.({nativeEvent: {width: 3200, height: 2400}});
        });

        expect(screen.queryByTestId('ImageViewLoading')).not.toBeOnTheScreen();

        await act(async () => {
            latestImageProps?.onLoadStart?.();
        });

        expect(screen.getByTestId('ImageViewLoading')).toBeOnTheScreen();
    });
});
