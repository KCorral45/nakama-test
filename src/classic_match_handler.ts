const moduleName_classic = "classic"
const classicTickRate = 5;
const maxEmptySec = 30;

interface State {
  // Ticks where no actions have occurred.
  emptyTicks: number
  // Currently connected users, or reserved spaces.
  presences: {[userId: string]: nkruntime.Presence | null}
  // Number of users currently in the process of connecting to the match.
  joinsInProgress: number
  // True if there's a game currently in progress.
  playing: boolean
  // Ticks until the next game starts, if applicable.
  nextGameRemainingTicks: number
}


let classicMatchInit: nkruntime.MatchInitFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: {[key: string]: string}) {
  logger.debug('Lobby match created');

  var state: State = {
    emptyTicks: 0,
    presences: {},
    joinsInProgress: 0,
    playing: false,
    nextGameRemainingTicks: 0,
  }

  return {
    state,
    tickRate: classicTickRate,
    label: "classic"
  };
};

let classicMatchJoin: nkruntime.MatchJoinFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, presences: nkruntime.Presence[]) {
  presences.forEach(function (presence) {
    state.presences[presence.userId] = presence;
    logger.debug('%q joined Lobby match', presence.userId);
  });

  for (const presence of presences) {
    state.emptyTicks = 0;
    state.presences[presence.userId] = presence;
    state.joinsInProgress--;
  }
  
  return {
    state
  };
}

let classicMatchJoinAttempt: nkruntime.MatchJoinAttemptFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, presence: nkruntime.Presence, metadata: {[key: string]: any }) : {state: State, accept: boolean, rejectMessage?: string | undefined } | null {
  logger.debug('%q attempted to join Lobby match', ctx.userId);

  // Check if it's a user attempting to rejoin after a disconnect.
    if (presence.userId in state.presences) {
      if (state.presences[presence.userId] === null) {
        // User rejoining after a disconnect.
        state.joinsInProgress++;
        return {
          state: state,
          accept: false,
        }
      } else {
        // User attempting to join from 2 different devices at the same time.
        return {
          state: state,
          accept: false,
          rejectMessage: 'already joined',
        }
      }
    }

    // Check if match is full.
    if (connectedPlayers(state) + state.joinsInProgress >= 2) {
      return {
          state: state,
          accept: false,
          rejectMessage: 'match full',
      };
    }

  // New player attempting to connect.
  state.joinsInProgress++;
  return {
    state,
    accept: true
  };
}

let classicMatchLeave: nkruntime.MatchLeaveFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, presences: nkruntime.Presence[]) {
  for (let presence of presences) {
    logger.info("Player: %s left match: %s.", presence.userId, ctx.matchId);
    state.presences[presence.userId] = null;
  }
  
  return {
    state
  };
}

let classicMatchLoop: nkruntime.MatchLoopFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, messages: nkruntime.MatchMessage[]) {
  logger.debug('Running match loop. Tick: %d; Empty Ticks: %d; Connected Players: %d', tick, state.emptyTicks, connectedPlayers(state));

  // If we have no presences in the match according to the match state, increment the empty ticks count
  if (connectedPlayers(state) + state.joinsInProgress === 0) {
    state.emptyTicks++;
    if (state.emptyTicks >= maxEmptySec * classicTickRate) {
      // Match has been empty for too long, close it.
      logger.info('Closing Idle Match');
      return null;
    }
  }
  
  return {
    state
  };
}

let classicMatchSignal: nkruntime.MatchSignalFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, data: string) {
  logger.debug('Lobby match signal received: ' + data);
  
  return {
    state,
    data: "Lobby match signal received: " + data
  };
}

let classicMatchTerminate: nkruntime.MatchTerminateFunction<State> = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: State, graceSeconds: number) {
  logger.debug('Lobby match terminated');
  
  return {
    state
  };
}

function connectedPlayers(s: State): number {
  let count = 0;
  for(const p of Object.keys(s.presences)) {
    if (s.presences[p] !== null) {
        count++;
    }
  }
  return count;
}