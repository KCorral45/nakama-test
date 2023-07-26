const moduleName_classic = "classic"

const classicMatchInit = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: {[key: string]: string}): {state: nkruntime.MatchState, tickRate: number, label: string} {
	logger.debug('Lobby match created');
  
	return {
	  state: { 
      Debug: true
    },
	  tickRate: 10,
	  label: "classic"
	};
};

const classicMatchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) : { state: nkruntime.MatchState } | null {
	presences.forEach(function (presence) {
	  state.presences[presence.userId] = presence;
	  logger.debug('%q joined Lobby match', presence.userId);
	});
  
	return {
	  state
	};
}

const classicMatchJoinAttempt = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presence: nkruntime.Presence, metadata: {[key: string]: any }) : {state: nkruntime.MatchState, accept: boolean, rejectMessage?: string | undefined } | null {
	logger.debug('%q attempted to join Lobby match', ctx.userId);
  
	return {
	  state,
	  accept: true
	};
}

const classicMatchLeave = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) : { state: nkruntime.MatchState } | null {
	presences.forEach(function (presence) {
	  state.presences[presence.userId] = presence;
	  logger.debug('%q left Lobby match', presence.userId);
	});
  
	return {
	  state
	};
}

const classicMatchLoop = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, messages: nkruntime.MatchMessage[]) : { state: nkruntime.MatchState} | null {
	// If we have no presences in the match according to the match state, increment the empty ticks count
  if (state.presences.length === 0) {
    state.emptyTicks++;
  }

  // If the match has been empty for more than 100 ticks, end the match by returning null
  if (state.emptyTicks > 100) {
    return null;
  }
  
	return {
	  state
	};
}

const classicMatchSignal = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, data: string) : { state: nkruntime.MatchState, data?: string } | null {
	logger.debug('Lobby match signal received: ' + data);
  
	return {
		state,
		data: "Lobby match signal received: " + data
	};
}

const classicMatchTerminate = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, graceSeconds: number) : { state: nkruntime.MatchState} | null {
	logger.debug('Lobby match terminated');
  
	return {
	  state
	};
}