type RealtimeChannelType = "public" | "private";

type RealtimeDebugChannel = {
    error: (callback: CallableFunction) => unknown;
    listenToAll: (callback: CallableFunction) => unknown;
    stopListeningToAll: (callback?: CallableFunction) => unknown;
    subscribed: (callback: CallableFunction) => unknown;
};

type RealtimeChannelDebugOptions = {
    channelName: string;
    channelType: RealtimeChannelType;
    scope: string;
};

function buildChannelMeta({
    channelName,
    channelType,
}: Omit<RealtimeChannelDebugOptions, "scope">) {
    return {
        channel: `${channelType}:${channelName}`,
        channelName,
        channelType,
    };
}

export function logRealtimeConnection(message: string, details?: unknown) {
    void message;
    void details;
}

export function logRealtimeLifecycle(
    scope: string,
    message: string,
    details?: unknown,
) {
    void scope;
    void message;
    void details;
}

export function attachRealtimeChannelDebug(
    channel: RealtimeDebugChannel,
    options: RealtimeChannelDebugOptions,
) {
    const channelMeta = buildChannelMeta(options);

    logRealtimeLifecycle(options.scope, "Subscribing to channel", channelMeta);

    const handleAnyEvent = (eventName: string, payload: unknown) => {
        logRealtimeLifecycle(
            options.scope,
            `Event received: ${eventName}`,
            {
                ...channelMeta,
                payload,
            },
        );
    };

    channel.subscribed(() => {
        logRealtimeLifecycle(
            options.scope,
            "Channel subscription succeeded",
            channelMeta,
        );
    });

    channel.error((error: unknown) => {
        console.error(
            `[realtime:${options.scope}] Channel subscription failed`,
            {
                ...channelMeta,
                error,
            },
        );
    });

    channel.listenToAll(handleAnyEvent);

    return () => {
        channel.stopListeningToAll(handleAnyEvent);
        logRealtimeLifecycle(
            options.scope,
            "Detached channel debug listener",
            channelMeta,
        );
    };
}
