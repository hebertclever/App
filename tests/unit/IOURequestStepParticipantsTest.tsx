import {render} from '@testing-library/react-native';
import React from 'react';
import Navigation from '@libs/Navigation/Navigation';
import IOURequestStepParticipants from '@pages/iou/request/step/IOURequestStepParticipants';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

let participantsSelectorProps: {onFinish?: () => void} | undefined;

jest.mock('@pages/iou/request/MoneyRequestParticipantsSelector', () => {
    const ReactMock = jest.requireActual('react') as typeof React;
    return (props: unknown) => {
        participantsSelectorProps = props as {onFinish?: () => void};
        return ReactMock.createElement('mock-participants-selector', null);
    };
});

jest.mock('@pages/iou/request/step/StepScreenWrapper', () => {
    const ReactMock = jest.requireActual('react') as typeof React;
    return ({children}: {children: React.ReactNode}) => ReactMock.createElement('mock-step-screen-wrapper', null, children);
});

jest.mock('@pages/iou/request/step/withWritableReportOrNotFound', () => (Component: unknown) => Component);
jest.mock('@pages/iou/request/step/withFullTransactionOrNotFound', () => (Component: unknown) => Component);

jest.mock('@react-navigation/core', () => ({
    useIsFocused: () => false,
}));

jest.mock('@react-navigation/native', () => ({
    createNavigationContainerRef: jest.fn(() => ({
        current: null,
        isReady: jest.fn(() => true),
        navigate: jest.fn(),
        dispatch: jest.fn(),
        goBack: jest.fn(),
        canGoBack: jest.fn(() => true),
        getRootState: jest.fn(),
    })),
}));

jest.mock('@hooks/useLocalize', () => () => ({
    translate: (key: string) => key,
}));

jest.mock('@hooks/useThemeStyles', () => () => ({}));

jest.mock('@hooks/useCurrentUserPersonalDetails', () => () => ({
    accountID: 1,
    login: 'test@example.com',
}));

jest.mock('@hooks/useOnyx', () => () => [undefined]);

jest.mock('@libs/ReportUtils', () => {
    const actual = jest.requireActual('@libs/ReportUtils');
    return {
        ...actual,
        findSelfDMReportID: jest.fn(() => 'selfDMReportID'),
        generateReportID: jest.fn(() => 'generatedReportID'),
        isInvoiceRoomWithID: jest.fn(() => false),
    };
});

jest.mock('@libs/Navigation/Navigation', () => ({
    goBack: jest.fn(),
}));

describe('IOURequestStepParticipants', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        participantsSelectorProps = undefined;
    });

    it('redirects to StartPage (submit) when preselecting a workspace destination', () => {
        const optimisticReportID = 'optimisticReportID';
        const workspaceReportID = 'workspaceReportID';

        render(
            // @ts-expect-error - partial props for testing
            <IOURequestStepParticipants
                route={{
                    params: {
                        action: CONST.IOU.ACTION.CREATE,
                        iouType: CONST.IOU.TYPE.CREATE,
                        reportID: optimisticReportID,
                        transactionID: CONST.IOU.OPTIMISTIC_TRANSACTION_ID,
                    },
                }}
                transaction={{
                    transactionID: CONST.IOU.OPTIMISTIC_TRANSACTION_ID,
                    participants: [{reportID: workspaceReportID, isPolicyExpenseChat: true, selected: true}],
                }}
            />,
        );

        participantsSelectorProps?.onFinish?.();

        expect(Navigation.goBack).toHaveBeenCalledWith(
            ROUTES.MONEY_REQUEST_CREATE.getRoute(CONST.IOU.ACTION.CREATE, CONST.IOU.TYPE.SUBMIT, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, workspaceReportID),
            {compareParams: false},
        );
    });

    it('redirects to StartPage (track) when preselecting the self DM destination', () => {
        const optimisticReportID = 'optimisticReportID';
        const selfDMReportID = 'selfDMReportID';

        render(
            // @ts-expect-error - partial props for testing
            <IOURequestStepParticipants
                route={{
                    params: {
                        action: CONST.IOU.ACTION.CREATE,
                        iouType: CONST.IOU.TYPE.CREATE,
                        reportID: optimisticReportID,
                        transactionID: CONST.IOU.OPTIMISTIC_TRANSACTION_ID,
                    },
                }}
                transaction={{
                    transactionID: CONST.IOU.OPTIMISTIC_TRANSACTION_ID,
                    participants: [{reportID: selfDMReportID, isSelfDM: true, selected: true}],
                }}
            />,
        );

        participantsSelectorProps?.onFinish?.();

        expect(Navigation.goBack).toHaveBeenCalledWith(
            ROUTES.MONEY_REQUEST_CREATE.getRoute(CONST.IOU.ACTION.CREATE, CONST.IOU.TYPE.TRACK, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, selfDMReportID),
            {compareParams: false},
        );
    });
});
