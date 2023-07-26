function getMatchListings(context: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama) {
  const limit = 10
  const isAuthoritative = false;
  const label = "";
  const minSize = 0;
  const maxSize = 4;
  const matches = nk.matchList(limit, isAuthoritative, label, minSize, maxSize, "");

  matches.forEach(function (match) {
    logger.info("Match id '%s'", match.matchId);
  });
}